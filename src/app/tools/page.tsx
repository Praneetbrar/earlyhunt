import type { Metadata } from "next";
import Link from "next/link";
import { directoryData } from "@/lib/directories";

export const metadata: Metadata = {
  title: "Free launch tools",
  description:
    "Free EarlyHunt tools for founders planning a launch, including a filterable list of startup and SaaS launch directories.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  const count = directoryData.directories.length;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#222288]">Tools</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Free tools for a launch</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
        Utilities for founders who are deciding where to launch. The directory finder is free to use.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        <li>
          <Link
            href="/tools/launch-directory-finder"
            className="block rounded-2xl border border-gray-200 p-6 transition hover:border-[#222288]/40 hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold text-gray-900">Launch Directory Finder</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Filter {count} startup launch directories and SaaS launch directories by price, dofollow, audience, and
              approximate Domain Rating.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/100-places-to-launch-your-startup"
            className="block rounded-2xl border border-gray-200 p-6 transition hover:border-[#222288]/40 hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold text-gray-900">100+ places to launch</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The written guide that sits next to the finder, for founders who want the story as well as the table.
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
