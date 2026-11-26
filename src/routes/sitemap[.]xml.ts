import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { projects } from "@/data/projects";

const BASE_URL = "https://efcsys.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let articleSlugs: string[] = [];
        try {
          const url = import.meta.env['VITE_SUPABASE_URL'];
          const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
          if (url && key) {
            const res = await fetch(
              `${url}/rest/v1/articles?select=slug&is_published=eq.true`,
              { headers: { apikey: key } },
            );
            if (res.ok) {
              const rows = (await res.json()) as { slug: string }[];
              articleSlugs = rows.map((r) => r.slug);
            }
          }
        } catch {
          articleSlugs = [];
        }

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/projects", changefreq: "weekly", priority: "0.9" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/technologies", changefreq: "monthly", priority: "0.7" },
          { path: "/articles", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.8" },
          ...projects.map((p) => ({
            path: `/projects/${encodeURIComponent(p.slug)}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...articleSlugs.map((s) => ({
            path: `/articles/${encodeURIComponent(s)}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
