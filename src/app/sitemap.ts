import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://digitalheavyweights.com";
  const now = new Date().toISOString();

  return [
    // Core pages
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Case studies
    { url: `${baseUrl}/case-studies/halleman-construction`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Blog
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog/5-reasons-eugene-contractors-lose-leads`, lastModified: "2026-02-15", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/lead-management-system-captures-more-customers`, lastModified: "2026-02-14", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/contractor-website-local-seo-eugene`, lastModified: "2026-02-13", changeFrequency: "monthly", priority: 0.6 },

    // SEO landing pages
    { url: `${baseUrl}/contractor-lead-management-eugene`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contractor-website-eugene`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/project-estimator-contractors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/lead-capture-system-contractors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
