"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SmoothLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
  };

export function SmoothLink({
  href,
  children,
  onClick,
  target,
  ...props
}: SmoothLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank" ||
      typeof href !== "string"
    ) {
      return;
    }

    event.preventDefault();

    if ("startViewTransition" in document) {
      document.startViewTransition(() => router.push(href));
      return;
    }

    router.push(href);
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
