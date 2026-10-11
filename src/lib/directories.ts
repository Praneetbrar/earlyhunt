import data from "@/data/launch-directories.json";

export type PriceTier = "free" | "freemium" | "paid" | "unknown";
export type PriceCertainty = "confirmed" | "snapshot" | "unknown";
export type Dofollow = "yes" | "no" | "premium" | "mixed" | "unknown";
export type DrSource =
  | "ahrefs-snapshot-2026-09-06"
  | "site-stated-2026-10-11";

export type LaunchDirectory = {
  id: string;
  name: string;
  url: string;
  category: string;
  audience: string;
  priceTier: PriceTier;
  priceLabel: string;
  priceAmount: number | null;
  priceCertainty: PriceCertainty;
  dofollow: Dofollow;
  dr: number | null;
  drSource: DrSource | null;
  network: boolean;
  notes: string;
};

export type DirectoryFile = {
  updated: string;
  drNote: string;
  priceNote: string;
  dofollowNote: string;
  directories: LaunchDirectory[];
};

export const directoryData = data as DirectoryFile;

const PRICE_TIERS = new Set<PriceTier>(["free", "freemium", "paid", "unknown"]);
const CERTAINTIES = new Set<PriceCertainty>(["confirmed", "snapshot", "unknown"]);
const DOFOLLOWS = new Set<Dofollow>(["yes", "no", "premium", "mixed", "unknown"]);
const DR_SOURCES = new Set<DrSource>([
  "ahrefs-snapshot-2026-09-06",
  "site-stated-2026-10-11",
]);

if (directoryData.directories.length < 100) {
  throw new Error("Launch Directory Finder needs at least 100 directories.");
}

for (const directory of directoryData.directories) {
  if (!PRICE_TIERS.has(directory.priceTier)) {
    throw new Error(`Invalid price tier for ${directory.name}`);
  }
  if (!CERTAINTIES.has(directory.priceCertainty)) {
    throw new Error(`Invalid price certainty for ${directory.name}`);
  }
  if (!DOFOLLOWS.has(directory.dofollow)) {
    throw new Error(`Invalid dofollow value for ${directory.name}`);
  }
  if (directory.dr == null && directory.drSource != null) {
    throw new Error(`DR source without a DR for ${directory.name}`);
  }
  if (directory.dr != null && (directory.drSource == null || !DR_SOURCES.has(directory.drSource))) {
    throw new Error(`DR without a known source for ${directory.name}`);
  }
}

export const DOFOLLOW_LABEL: Record<Dofollow, string> = {
  yes: "Yes",
  no: "No",
  premium: "Premium",
  mixed: "Mixed",
  unknown: "Unknown",
};

export function drTitle(directory: LaunchDirectory): string {
  if (directory.dr == null || directory.drSource == null) {
    return "No approximate Domain Rating is cited for this directory.";
  }
  if (directory.drSource === "ahrefs-snapshot-2026-09-06") {
    return "Approximate Ahrefs Domain Rating from a 6 September 2026 snapshot.";
  }
  return "Approximate Domain Rating stated on this directory's pricing page on 11 October 2026.";
}

export function formatDr(directory: LaunchDirectory): string {
  return directory.dr == null ? "—" : `~${directory.dr}`;
}
