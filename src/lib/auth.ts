export const USER_ROLE = "user";
export const ADMIN_ROLE = "admin";
export const AUTH_COOKIE = "temuin_role";

export const publicPaths = ["/", "/login", "/register", "/admin/login"];
export const userProtectedPrefixes = [
  "/barang-temuan",
  "/lapor-kehilangan",
  "/lapor-temuan",
  "/verifikasi-kepemilikan",
  "/status",
  "/profil",
];
export const adminProtectedPrefixes = [
  "/admin/antrian",
  "/admin/dashboard",
  "/admin/laporan-kehilangan",
  "/admin/laporan-temuan",
  "/admin/verifikasi-kepemilikan",
  "/admin/pengguna",
];
