import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const data = JSON.parse(
  readFileSync(new URL("../src/data/launch-directories.json", import.meta.url), "utf8"),
);
const page = readFileSync(
  new URL("../src/app/tools/launch-directory-finder/page.tsx", import.meta.url),
  "utf8",
);
const footer = readFileSync(new URL("../src/components/site-footer.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");

const categories = new Set([
  "Launch platform",
  "Startup directory",
  "SaaS directory",
  "AI directory",
  "Developer tools",
  "Community",
  "Deals",
  "Review site",
  "No-code",
  "API directory",
  "Design",
]);

test("lists at least 100 real directory records", () => {
  assert.ok(data.directories.length >= 100);
  const ids = data.directories.map((directory) => directory.id);
  const urls = data.directories.map((directory) => directory.url);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(urls).size, urls.length);
});

test("every row has a usable https URL, category, and note", () => {
  for (const directory of data.directories) {
    assert.match(directory.url, /^https:\/\/[^/]+/);
    assert.ok(categories.has(directory.category), directory.category);
    assert.ok(directory.notes.length > 40, directory.name);
    assert.ok(["free", "freemium", "paid", "unknown"].includes(directory.priceTier));
    assert.ok(["confirmed", "snapshot", "unknown"].includes(directory.priceCertainty));
    assert.ok(["yes", "no", "premium", "mixed", "unknown"].includes(directory.dofollow));
  }
});

test("Domain Rating is only present with a cited source", () => {
  for (const directory of data.directories) {
    if (directory.dr == null) {
      assert.equal(directory.drSource, null, directory.name);
      continue;
    }
    assert.equal(Number.isInteger(directory.dr), true, directory.name);
    assert.ok(directory.dr >= 0 && directory.dr <= 100);
    assert.ok(
      ["ahrefs-snapshot-2026-09-06", "site-stated-2026-10-11"].includes(directory.drSource),
      directory.name,
    );
  }
});

test("snapshot prices above zero are marked approximate", () => {
  for (const directory of data.directories) {
    if (directory.priceCertainty === "snapshot" && directory.priceAmount > 0) {
      assert.match(directory.priceLabel, /~/, directory.name);
    }
  }
});

test("network prices match the public pricing pages", () => {
  const network = Object.fromEntries(
    data.directories.filter((directory) => directory.network).map((directory) => [directory.name, directory]),
  );
  assert.deepEqual(Object.keys(network).sort(), [
    "Aura++",
    "EarlyHunt",
    "IndieHunt",
    "MakerHunt",
    "SideHunt",
    "Uno Directory",
  ]);
  for (const name of ["EarlyHunt", "IndieHunt", "MakerHunt", "SideHunt"]) {
    assert.equal(network[name].priceLabel, "Free or $19");
    assert.equal(network[name].priceAmount, 19);
    assert.equal(network[name].dofollow, "premium");
    assert.doesNotMatch(network[name].notes, /\$10/);
  }
  assert.equal(network["Aura++"].priceLabel, "Free, $29, or $69");
  assert.equal(network["Aura++"].priceAmount, 29);
  assert.equal(network["Uno Directory"].priceLabel, "Free or $10");
  assert.equal(network["Uno Directory"].priceAmount, 10);
});

test("well-known launch directories are present", () => {
  const names = new Set(data.directories.map((directory) => directory.name));
  for (const name of [
    "Product Hunt",
    "BetaList",
    "Uneed",
    "Peerlist",
    "DevHunt",
    "Fazier",
    "Indie Hackers",
    "Hacker News Show HN",
    "TinyLaunch",
  ]) {
    assert.ok(names.has(name), name);
  }
});

test("the page, nav, footer, and sitemap expose the tool", () => {
  assert.match(page, /Launch Directory Finder/);
  assert.match(page, /saas launch directories/i);
  assert.match(page, /startup launch directories/i);
  assert.match(page, /FAQPage/);
  assert.match(page, /\/tools\/launch-directory-finder/);
  assert.match(header, /\/tools\/launch-directory-finder/);
  assert.match(footer, /Tools/);
  assert.match(footer, /\/tools\/launch-directory-finder/);
  assert.match(sitemap, /https:\/\/earlyhunt.com\/tools\/launch-directory-finder/);
});
