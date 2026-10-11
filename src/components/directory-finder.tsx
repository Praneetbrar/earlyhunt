"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  DOFOLLOW_LABEL,
  type Dofollow,
  type LaunchDirectory,
  drTitle,
  formatDr,
} from "@/lib/directories";

type SortKey = "name" | "dr" | "price" | "dofollow" | "audience";

type Filters = {
  query: string;
  tier: string;
  dofollow: string;
  category: string;
  audience: string;
  drMin: number;
  networkOnly: boolean;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
};

const SEARCH_EVENT = "directory-finder-search";

function subscribeToSearch(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(SEARCH_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(SEARCH_EVENT, onStoreChange);
  };
}

function readFilters(search: string, categories: string[], audiences: string[]): Filters {
  const params = new URLSearchParams(search);
  const sort = params.get("sort");
  const direction = params.get("dir");
  const dr = Number(params.get("dr") ?? "0");
  const category = params.get("category") ?? "all";
  const audience = params.get("audience") ?? "all";
  return {
    query: params.get("q") ?? "",
    tier: params.get("price") ?? "all",
    dofollow: params.get("dofollow") ?? "all",
    category: categories.includes(category) ? category : "all",
    audience: audiences.includes(audience) ? audience : "all",
    drMin: dr === 40 || dr === 60 || dr === 70 ? dr : 0,
    networkOnly: params.get("network") === "1",
    sortKey: sort === "name" || sort === "dr" || sort === "price" || sort === "dofollow" || sort === "audience" ? sort : "dr",
    sortDir: direction === "asc" || direction === "desc" ? direction : "desc",
  };
}

function writeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.tier !== "all") params.set("price", filters.tier);
  if (filters.dofollow !== "all") params.set("dofollow", filters.dofollow);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.audience !== "all") params.set("audience", filters.audience);
  if (filters.drMin > 0) params.set("dr", String(filters.drMin));
  if (filters.networkOnly) params.set("network", "1");
  if (filters.sortKey !== "dr") params.set("sort", filters.sortKey);
  if (filters.sortDir !== "desc") params.set("dir", filters.sortDir);
  const queryString = params.toString();
  const next = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
  window.history.replaceState(null, "", next);
  window.dispatchEvent(new Event(SEARCH_EVENT));
}

const DOFOLLOW_ORDER: Dofollow[] = ["yes", "premium", "mixed", "no", "unknown"];

const DOFOLLOW_CLASS: Record<Dofollow, string> = {
  yes: "bg-emerald-50 text-emerald-800 border-emerald-200",
  premium: "bg-[#222288]/10 text-[#222288] border-[#222288]/20",
  mixed: "bg-amber-50 text-amber-800 border-amber-200",
  no: "bg-gray-100 text-gray-600 border-gray-200",
  unknown: "bg-white text-gray-400 border-gray-200",
};

function compare(a: LaunchDirectory, b: LaunchDirectory, key: SortKey, direction: "asc" | "desc") {
  const sign = direction === "asc" ? 1 : -1;
  if (key === "name" || key === "audience") {
    return a[key].localeCompare(b[key]) * sign;
  }
  if (key === "dr") {
    if (a.dr == null && b.dr == null) return a.name.localeCompare(b.name);
    if (a.dr == null) return 1;
    if (b.dr == null) return -1;
    return (a.dr - b.dr) * sign || a.name.localeCompare(b.name);
  }
  if (key === "price") {
    if (a.priceAmount == null && b.priceAmount == null) return a.name.localeCompare(b.name);
    if (a.priceAmount == null) return 1;
    if (b.priceAmount == null) return -1;
    return (a.priceAmount - b.priceAmount) * sign || a.name.localeCompare(b.name);
  }
  const diff = DOFOLLOW_ORDER.indexOf(a.dofollow) - DOFOLLOW_ORDER.indexOf(b.dofollow);
  return diff * sign || a.name.localeCompare(b.name);
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

function downloadCsv(rows: LaunchDirectory[]) {
  const header = [
    "Name",
    "URL",
    "Category",
    "Audience",
    "Price",
    "Price certainty",
    "Dofollow",
    "Approximate DR",
    "DR source",
    "Network",
    "Notes",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.url,
        row.category,
        row.audience,
        row.priceLabel,
        row.priceCertainty,
        DOFOLLOW_LABEL[row.dofollow],
        row.dr == null ? "" : String(row.dr),
        row.drSource ?? "",
        row.network ? "yes" : "no",
        row.notes,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "startup-launch-directories.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function DirectoryFinder({ directories }: { directories: LaunchDirectory[] }) {
  const [copied, setCopied] = useState(false);
  const search = useSyncExternalStore(subscribeToSearch, () => window.location.search, () => "");

  const categories = useMemo(
    () => Array.from(new Set(directories.map((directory) => directory.category))).sort(),
    [directories],
  );
  const audiences = useMemo(
    () => Array.from(new Set(directories.map((directory) => directory.audience))).sort(),
    [directories],
  );
  const filters = useMemo(
    () => readFilters(search, categories, audiences),
    [audiences, categories, search],
  );
  const { query, tier, dofollow, category, audience, drMin, networkOnly, sortKey, sortDir } = filters;

  function updateFilters(partial: Partial<Filters>) {
    writeFilters({ ...filters, ...partial });
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return directories
      .filter((directory) => {
        if (networkOnly && !directory.network) return false;
        if (tier !== "all" && directory.priceTier !== tier) return false;
        if (dofollow !== "all" && directory.dofollow !== dofollow) return false;
        if (category !== "all" && directory.category !== category) return false;
        if (audience !== "all" && directory.audience !== audience) return false;
        if (drMin > 0 && (directory.dr == null || directory.dr < drMin)) return false;
        if (!needle) return true;
        const haystack = [
          directory.name,
          directory.url,
          directory.category,
          directory.audience,
          directory.notes,
          directory.priceLabel,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [audience, category, directories, dofollow, drMin, networkOnly, query, sortDir, sortKey, tier]);

  function onSort(key: SortKey) {
    if (sortKey === key) {
      updateFilters({ sortDir: sortDir === "asc" ? "desc" : "asc" });
      return;
    }
    updateFilters({
      sortKey: key,
      sortDir: key === "name" || key === "audience" ? "asc" : "desc",
    });
  }

  function reset() {
    writeFilters({
      query: "",
      tier: "all",
      dofollow: "all",
      category: "all",
      audience: "all",
      drMin: 0,
      networkOnly: false,
      sortKey: "dr",
      sortDir: "desc",
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const filtersActive =
    query !== "" ||
    tier !== "all" ||
    dofollow !== "all" ||
    category !== "all" ||
    audience !== "all" ||
    drMin > 0 ||
    networkOnly;

  return (
    <section aria-labelledby="directory-results-heading" className="mt-8">
      <h2 id="directory-results-heading" className="sr-only">
        Filterable directory table
      </h2>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <label className="block text-xs font-medium text-gray-500" htmlFor="directory-search">
          Search directories
        </label>
        <input
          id="directory-search"
          value={query}
          onChange={(event) => updateFilters({ query: event.target.value })}
          placeholder="Search name, audience, or notes"
          className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900 outline-none ring-[#222288] placeholder:text-gray-400 focus:border-[#222288] focus:ring-2"
        />

        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <FilterSelect id="price-filter" label="Price" value={tier} onChange={(value) => updateFilters({ tier: value })}>
            <option value="all">Any price</option>
            <option value="free">Free</option>
            <option value="freemium">Free and paid</option>
            <option value="paid">Paid</option>
            <option value="unknown">Check site</option>
          </FilterSelect>
          <FilterSelect id="dofollow-filter" label="Dofollow" value={dofollow} onChange={(value) => updateFilters({ dofollow: value })}>
            <option value="all">Any link type</option>
            <option value="yes">Yes</option>
            <option value="premium">Premium only</option>
            <option value="mixed">Mixed</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </FilterSelect>
          <FilterSelect id="category-filter" label="Category" value={category} onChange={(value) => updateFilters({ category: value })}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect id="audience-filter" label="Audience" value={audience} onChange={(value) => updateFilters({ audience: value })}>
            <option value="all">All audiences</option>
            {audiences.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            id="dr-filter"
            label="Approx. DR"
            value={String(drMin)}
            onChange={(value) => updateFilters({ drMin: Number(value) })}
          >
            <option value="0">Any DR</option>
            <option value="40">~40 and up</option>
            <option value="60">~60 and up</option>
            <option value="70">~70 and up</option>
          </FilterSelect>
          <label className="flex items-end gap-2 pb-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={networkOnly}
              onChange={(event) => updateFilters({ networkOnly: event.target.checked })}
              className="h-4 w-4 accent-[#222288]"
            />
            Network only
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{visible.length}</span> of {directories.length}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadCsv(visible)}
              className="h-9 rounded-lg border border-gray-200 px-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Download CSV
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="h-9 rounded-lg border border-gray-200 px-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
            >
              {copied ? "Link copied" : "Copy filter link"}
            </button>
            {filtersActive ? (
              <button
                type="button"
                onClick={reset}
                className="h-9 rounded-lg px-3 text-[13px] font-medium text-[#222288] hover:bg-[#222288]/5"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
          No directories match these filters. Clear a filter or search a broader term.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3 lg:hidden">
            {visible.map((directory) => (
              <li key={directory.id} className="rounded-2xl border border-gray-200 p-4">
                <DirectoryIdentity directory={directory} />
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Fact label="Approx. DR" value={formatDr(directory)} title={drTitle(directory)} />
                  <Fact label="Price" value={directory.priceLabel} />
                  <div>
                    <dt className="text-xs text-gray-500">Dofollow</dt>
                    <dd className="mt-1">
                      <DofollowBadge value={directory.dofollow} />
                    </dd>
                  </div>
                  <Fact label="Audience" value={directory.audience} />
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{directory.notes}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-gray-200 lg:block">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Startup and SaaS launch directories with approximate Domain Rating, price, and dofollow status
              </caption>
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <SortHeader label="Name" sortKey="name" activeKey={sortKey} direction={sortDir} onSort={onSort} />
                  <SortHeader label="Approx. DR" sortKey="dr" activeKey={sortKey} direction={sortDir} onSort={onSort} />
                  <SortHeader label="Price" sortKey="price" activeKey={sortKey} direction={sortDir} onSort={onSort} />
                  <SortHeader label="Dofollow" sortKey="dofollow" activeKey={sortKey} direction={sortDir} onSort={onSort} />
                  <SortHeader label="Audience" sortKey="audience" activeKey={sortKey} direction={sortDir} onSort={onSort} />
                  <th scope="col" className="px-4 py-3 font-medium">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((directory) => (
                  <tr key={directory.id} className="border-t border-gray-100 align-top hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <DirectoryIdentity directory={directory} />
                    </td>
                    <td className="px-4 py-4 font-semibold tabular-nums text-gray-900" title={drTitle(directory)}>
                      {formatDr(directory)}
                    </td>
                    <td className="px-4 py-4 text-gray-800">{directory.priceLabel}</td>
                    <td className="px-4 py-4">
                      <DofollowBadge value={directory.dofollow} />
                    </td>
                    <td className="px-4 py-4 text-gray-700">{directory.audience}</td>
                    <td className="px-4 py-4 text-gray-600">
                      <p className="line-clamp-3 max-w-md leading-relaxed" title={directory.notes}>
                        {directory.notes}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-gray-500" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm font-normal text-gray-800 outline-none focus:border-[#222288] focus:ring-2 focus:ring-[#222288]"
      >
        {children}
      </select>
    </label>
  );
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <th scope="col" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"} className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-gray-900"
      >
        {label}
        <span aria-hidden="true" className="text-[10px] text-gray-400">
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function DirectoryIdentity({ directory }: { directory: LaunchDirectory }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={directory.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-900 underline-offset-2 hover:text-[#222288] hover:underline"
        >
          {directory.name}
        </a>
        {directory.network ? (
          <span className="rounded-md bg-[#222288]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#222288]">
            Network
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-500">{directory.category}</p>
    </div>
  );
}

function DofollowBadge({ value }: { value: Dofollow }) {
  return (
    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${DOFOLLOW_CLASS[value]}`}>
      {DOFOLLOW_LABEL[value]}
    </span>
  );
}

function Fact({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div title={title}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  );
}
