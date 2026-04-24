-- SUPABASE DATABASE SCHEMA FOR TEMUIN

-- 0. Reset Existing Schema (For Seeding Adjustments)
DROP TABLE IF EXISTS public.claims CASCADE;
DROP TABLE IF EXISTS public.lost_items CASCADE;
DROP TABLE IF EXISTS public.found_items CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS found_status CASCADE;
DROP TYPE IF EXISTS lost_status CASCADE;
DROP TYPE IF EXISTS claim_status CASCADE;

-- 1. Create Custom Enum Types
CREATE TYPE user_role AS ENUM ('mahasiswa', 'admin');
CREATE TYPE user_status AS ENUM ('aktif', 'diblokir');
CREATE TYPE found_status AS ENUM ('Menunggu', 'Barang Diterima', 'Tayang', 'Telah Diklaim', 'Ditolak');
CREATE TYPE lost_status AS ENUM ('Mencari', 'Ditemukan', 'Selesai', 'Ditolak');
CREATE TYPE claim_status AS ENUM ('Menunggu', 'Diperiksa', 'Siap Diambil', 'Selesai', 'Ditolak');

-- 2. Create Users Table (Extending Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'mahasiswa'::user_role NOT NULL,
  status user_status DEFAULT 'aktif'::user_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) for Users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (true); -- Relaxed for seeding
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 3. Create Found Items Table
CREATE TABLE public.found_items (
  id TEXT PRIMARY KEY,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Can be null if admin manually inputs
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  found_date DATE NOT NULL,
  location TEXT NOT NULL,
  characteristics TEXT,
  contact_info TEXT,
  status found_status DEFAULT 'Menunggu'::found_status NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.found_items DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Found items are viewable by everyone if Tayang" ON public.found_items FOR SELECT USING (status = 'Tayang' OR auth.uid() = reporter_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Anyone authenticated can insert found item" ON public.found_items FOR INSERT WITH CHECK (true); -- Relaxed for seeding
CREATE POLICY "Admins can update found items" ON public.found_items FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- 4. Create Lost Items Table
CREATE TABLE public.lost_items (
  id TEXT PRIMARY KEY,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  lost_date DATE NOT NULL,
  location TEXT NOT NULL,
  characteristics TEXT,
  contact_info TEXT,
  status lost_status DEFAULT 'Mencari'::lost_status NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lost_items DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Lost items are viewable by everyone" ON public.lost_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert lost item" ON public.lost_items FOR INSERT WITH CHECK (true); -- Relaxed for seeding
CREATE POLICY "Admins can update lost items" ON public.lost_items FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- 5. Create Claims Table (Verifikasi Kepemilikan)
CREATE TABLE public.claims (
  id TEXT PRIMARY KEY,
  item_id TEXT REFERENCES public.found_items(id) ON DELETE CASCADE,
  claimer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status claim_status DEFAULT 'Menunggu'::claim_status NOT NULL,
  claim_notes TEXT,
  proof_image_urls TEXT[] NOT NULL DEFAULT '{}',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(item_id, claimer_id) -- Prevent duplicate claims on same item by same user
);

ALTER TABLE public.claims DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own claims and Admins can view all" ON public.claims FOR SELECT USING (auth.uid() = claimer_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own claims" ON public.claims FOR INSERT WITH CHECK (true); -- Relaxed for seeding
CREATE POLICY "Only admins can update claims" ON public.claims FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- 6. Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('proof-images', 'proof-images', false) ON CONFLICT (id) DO NOTHING; -- Private bucket

-- Storage Policies for item-images (Public)
DROP POLICY IF EXISTS "Public Access for Item Images" ON storage.objects;
CREATE POLICY "Public Access for Item Images" ON storage.objects FOR SELECT USING (bucket_id = 'item-images');

DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;
CREATE POLICY "Authenticated users can upload item images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-images' AND auth.role() = 'authenticated');

-- Storage Policies for proof-images (Private - RLS)
DROP POLICY IF EXISTS "Admin and Owner Access for Proof Images" ON storage.objects;
CREATE POLICY "Admin and Owner Access for Proof Images" ON storage.objects FOR SELECT USING (bucket_id = 'proof-images' AND (auth.uid() = owner OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'));

DROP POLICY IF EXISTS "Authenticated users can upload proof" ON storage.objects;
CREATE POLICY "Authenticated users can upload proof" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proof-images' AND auth.role() = 'authenticated');

-- 7. Automated Trigger for New User Signup
-- Whenever a new user signs up in Supabase Auth, this trigger creates a profile in public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'mahasiswa'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
