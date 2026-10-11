import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-11T00:00:00.000Z");
  return [
    {
      url: "https://earlyhunt.com/",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://earlyhunt.com/tools",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://earlyhunt.com/tools/launch-directory-finder",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
