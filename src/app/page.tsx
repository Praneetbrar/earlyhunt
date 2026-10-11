import type { Metadata } from "next";
import Link from "next/link";
import { directoryData } from "@/lib/directories";

export const metadata: Metadata = {
  title: { absolute: "EarlyHunt — AI Hunt Platform for Weekly Launches & Early Adopters | EarlyHunt" },
  description:
    "Hunt early AI products and weekly launches on EarlyHunt. Browse the Launch Directory Finder and submit your startup to reach early adopters.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const count = directoryData.directories.length;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b border-gray-200 pb-8">
        <Link
          href="/launches"
          className="inline-flex items-center rounded-full bg-[#222288] px-3 py-1 text-xs font-medium text-white hover:bg-[#1b1b6f]"
        >
          Explore weekly launches
        </Link>
        <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Launch early, and get hunted on <span className="text-[#222288]">EarlyHunt</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
          Submit a project, get a homepage week, and use the free directory finder when you are deciding where else to
          launch.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#222288] px-5 text-sm font-semibold text-white hover:bg-[#1b1b6f]"
          >
            Submit
          </Link>
          <Link
            href="/tools/launch-directory-finder"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Launch Directory Finder
          </Link>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-lg font-semibold text-gray-900">Free tool</h2>
        <Link
          href="/tools/launch-directory-finder"
          className="mt-4 block max-w-2xl rounded-2xl border border-gray-200 p-6 hover:border-[#222288]/30 hover:bg-gray-50"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[#222288]">Startup launch directories</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">Launch Directory Finder</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {count} SaaS and startup launch directories you can filter by price, dofollow, audience, and approximate
            Domain Rating.
          </p>
        </Link>
      </section>
    </div>
  );
}
