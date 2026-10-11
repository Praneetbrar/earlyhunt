"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tools/launch-directory-finder", label: "Directory finder" },
  { href: "/pricing", label: "Pricing" },
  { href: "/100-places-to-launch-your-startup", label: "100+ launch places" },
  { href: "/launch-guide", label: "Launch guide" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" title="EarlyHunt home">
          <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" priority />
          <span className="text-[17px] font-semibold tracking-tight text-gray-900">EarlyHunt</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-gray-50 hover:text-gray-900 ${
                  active ? "bg-gray-50 text-gray-900" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="inline-flex h-9 items-center rounded-lg bg-[#222288] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1b1b6f]"
          >
            Launch
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex h-9 cursor-pointer list-none items-center rounded-lg border border-gray-200 px-3 text-[13px] font-medium text-gray-700">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/tools" className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50">
                All tools
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
