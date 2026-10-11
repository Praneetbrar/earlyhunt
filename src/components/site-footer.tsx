import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Launch",
    links: [
      { href: "/submit", label: "Submit your project" },
      { href: "/pricing", label: "Pricing" },
      { href: "/premium-launches", label: "Premium launches" },
      { href: "/launch-kit", label: "Launch Kit" },
      { href: "/calender", label: "Launch calendar" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/projects", label: "Browse AI projects" },
      { href: "/launches", label: "Launch stories" },
      { href: "/hall-of-fame", label: "Hall of Fame" },
      { href: "/blog", label: "Blog" },
      { href: "/alternatives", label: "Alternatives" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/launch-directory-finder", label: "Launch Directory Finder" },
      { href: "/tools", label: "All tools" },
      { href: "/100-places-to-launch-your-startup", label: "100+ launch places" },
      { href: "/launch-guide", label: "Launch guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/help", label: "Help center" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#222288]/20 bg-[#0f1229] text-slate-300">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="text-[17px] font-semibold tracking-tight">EarlyHunt</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Weekly AI and startup launches for early adopters. New products go live every Monday.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#222288] hover:bg-slate-100"
          >
            Submit your project
          </Link>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-white">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EarlyHunt. All rights reserved.</p>
          <p>
            <a className="hover:text-white" href="https://x.com/praneetbrar">
              @praneetbrar
            </a>
            <span className="mx-2 text-slate-600">·</span>
            <a className="hover:text-white" href="mailto:hi@earlyhunt.com">
              hi@earlyhunt.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
