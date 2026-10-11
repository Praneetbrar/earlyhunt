import type { Metadata } from "next";
import Link from "next/link";
import { DirectoryFinder } from "@/components/directory-finder";
import { directoryData } from "@/lib/directories";

const PATH = "/tools/launch-directory-finder";
const TITLE = "Launch Directory Finder — SaaS & Startup Launch Directories";

function pageDescription() {
  const count = directoryData.directories.length;
  return `Filter ${count} startup launch directories and SaaS launch directories by price, dofollow links, audience, and approximate Domain Rating. Free tool from EarlyHunt.`;
}

const faqs = [
  {
    question: "What is a startup launch directory?",
    answer:
      "A startup launch directory is a site that lists new products so early users, founders, or buyers can find them. Some are one-day hunt communities such as Product Hunt. Others are permanent SaaS, AI, or startup directories. This page lists both, and you can filter by category.",
  },
  {
    question: "What are SaaS launch directories?",
    answer:
      "SaaS launch directories are the listings aimed at software products: comparison sites, tool directories, and launch platforms where a SaaS can be submitted. Filter the table to SaaS directory, Review site, or Launch platform depending on whether you want a lasting listing, reviews, or a launch-day audience.",
  },
  {
    question: "How should I read the approximate Domain Rating?",
    answer:
      "Domain Rating is an Ahrefs metric and it changes. A number appears only when we can cite a source: an Ahrefs snapshot from 6 September 2026, or the figure that directory printed on its own pricing page on 11 October 2026. The tilde means the figure is approximate. A dash means we did not have a number worth publishing. A high DR is not a promise that your page will rank.",
  },
  {
    question: "Does a listing include a dofollow backlink?",
    answer:
      "Sometimes. Dofollow means the listing link is not marked nofollow, ugc, or sponsored. This table uses Yes, No, Premium, Mixed, or Unknown. Premium means the paid plan is dofollow and the free plan is not. That is how EarlyHunt, IndieHunt, MakerHunt, SideHunt, Aura++, and Uno Directory work. Unknown means we did not measure that site. Open a live listing before you pay for SEO.",
  },
  {
    question: "Which startup launch directories are free?",
    answer:
      "Use the Price filter and choose Free. Product Hunt, Hacker News Show HN, Indie Hackers, Peerlist, and several communities are free to post. Free does not mean the link is dofollow. Hacker News and Reddit mark submitted links nofollow.",
  },
  {
    question: "How much does EarlyHunt Premium cost?",
    answer:
      "EarlyHunt Premium is $19 once. IndieHunt, MakerHunt, and SideHunt Premium are also $19 once. Those prices were checked on each pricing page on 11 October 2026. Free launches are still available. On EarlyHunt, a free launch needs a badge and stays nofollow unless the project finishes in the top 3.",
  },
  {
    question: "What do Aura++ and Uno Directory cost?",
    answer:
      "Aura++ Premium is $29 and Premium Plus is $69. Uno Directory is $10 one-time, with a free listing if you add a backlink. They are part of the same network as EarlyHunt. Those prices were checked on 11 October 2026.",
  },
  {
    question: "Are the Network directories independent?",
    answer:
      "No. EarlyHunt, IndieHunt, MakerHunt, SideHunt, Aura++, and Uno Directory are run by Praneet Brar. They are badged Network so this list does not pretend they are unaffiliated. They sort with the same rules as every other row.",
  },
  {
    question: "How often do prices and Domain Ratings change?",
    answer:
      "Often. Prices from the 6 September 2026 snapshot are marked with a tilde. Check site means the current fee was not verified for this release. Confirm the fee on the directory before you pay.",
  },
  {
    question: "Should I submit to every directory in this list?",
    answer:
      "No. Start with audiences you can show up for: a Product Hunt or EarlyHunt launch, Show HN if the product is technical, and a few directories that match the category. A handful of relevant listings is more useful than posting the same blurb everywhere on the same day.",
  },
];

export function generateMetadata(): Metadata {
  const description = pageDescription();
  return {
    title: { absolute: `${TITLE} | EarlyHunt` },
    description,
    keywords: [
      "saas launch directories",
      "startup launch directories",
      "launch directory finder",
      "product hunt alternatives",
      "dofollow launch directories",
    ],
    alternates: { canonical: PATH },
    openGraph: {
      title: `${TITLE} | EarlyHunt`,
      description,
      url: PATH,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | EarlyHunt`,
      description,
    },
  };
}

function jsonLd() {
  const count = directoryData.directories.length;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `https://earlyhunt.com${PATH}#app`,
        name: "Launch Directory Finder",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `https://earlyhunt.com${PATH}`,
        description: pageDescription(),
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@type": "Organization",
          name: "EarlyHunt",
          url: "https://earlyhunt.com",
        },
        featureList: [
          `${count} startup and SaaS launch directories`,
          "Filter by price, dofollow, category, and audience",
          "Sort by approximate Domain Rating",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://earlyhunt.com/" },
          { "@type": "ListItem", position: 2, name: "Tools", item: "https://earlyhunt.com/tools" },
          {
            "@type": "ListItem",
            position: 3,
            name: "Launch Directory Finder",
            item: `https://earlyhunt.com${PATH}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export default function LaunchDirectoryFinderPage() {
  const count = directoryData.directories.length;
  const withDr = directoryData.directories.filter((directory) => directory.dr != null).length;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tools" className="hover:text-gray-900">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900">Launch Directory Finder</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#222288]">Free SEO tool</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Launch Directory Finder
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          A filterable table of {count} startup launch directories and SaaS launch directories. Compare price,
          whether the listing link is dofollow, who the audience is, and an approximate Domain Rating when we have a
          figure we can cite. Use it to plan a launch week instead of collecting URLs in a spreadsheet.
        </p>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          EarlyHunt, IndieHunt, MakerHunt, SideHunt, Aura++, and Uno Directory are run by Praneet Brar and marked
          Network. Their public prices were checked on 11 October 2026: Premium is $19 on the Hunts, Aura++ Premium is
          $29 (Premium Plus is $69), and Uno Directory is $10. Other prices and every Domain Rating are approximate.
        </p>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Directories" value={String(count)} />
        <Stat label="With a cited DR" value={String(withDr)} />
        <Stat label="Updated" value="11 Oct 2026" />
        <Stat label="Price" value="Free" />
      </dl>

      <DirectoryFinder directories={directoryData.directories} />

      <section className="mt-10 max-w-3xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How to read the columns</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-gray-800">Approx. DR</span> always wears a tilde.{" "}
            {directoryData.drNote}
          </li>
          <li>
            <span className="font-medium text-gray-800">Price.</span> {directoryData.priceNote}
          </li>
          <li>
            <span className="font-medium text-gray-800">Dofollow.</span> {directoryData.dofollowNote}
          </li>
        </ul>
        <p className="mt-4">
          The narrative companion to this table is the{" "}
          <Link href="/100-places-to-launch-your-startup" className="font-medium text-[#222288] hover:underline">
            100+ places to launch your startup
          </Link>{" "}
          guide. For where EarlyHunt sits among other hunts, see{" "}
          <Link href="/alternatives" className="font-medium text-[#222288] hover:underline">
            alternatives
          </Link>{" "}
          and the{" "}
          <Link href="/launch-guide" className="font-medium text-[#222288] hover:underline">
            launch guide
          </Link>
          .
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-[#222288]/15 bg-[#222288]/[0.04] p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Launch on EarlyHunt when the list is done</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
          EarlyHunt Premium is $19 once if you want a guaranteed dofollow from this site, a skip of the free queue, and
          Launch Kit graphics. Free launches stay open. Premium on IndieHunt, MakerHunt, and SideHunt is the same $19.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#222288] px-5 text-sm font-semibold text-white hover:bg-[#1b1b6f]"
          >
            See pricing
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Submit a project
          </Link>
          <Link
            href="/premium-launches"
            className="inline-flex h-11 items-center justify-center px-2 text-sm font-semibold text-[#222288] hover:underline"
          >
            Premium launches
          </Link>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-gray-900">
          Launch directory questions
        </h2>
        <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-4 py-1 sm:px-5">
              <summary className="cursor-pointer list-none py-3 text-sm font-semibold text-gray-900">
                {faq.question}
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 px-4 py-3">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
