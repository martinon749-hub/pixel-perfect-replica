import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, Youtube } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/site/cards";
import { PageHeader } from "@/components/site/sections";
import { videosQuery } from "@/lib/content.queries";
import { YOUTUBE_SUBSCRIBE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/videos/")({
  head: () => ({
    meta: [
      { title: "Videos — Couple of Dumpsters" },
      {
        name: "description",
        content: "Watch every Couple of Dumpsters dumpster-diving adventure: big hauls, charity finds, investigations and more.",
      },
      { property: "og:title", content: "Videos — Couple of Dumpsters" },
      { property: "og:description", content: "Every dumpster-diving adventure from Amir and Ruth, in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(videosQuery()),
  component: VideosPage,
});

function VideosPage() {
  const { data: videos } = useSuspenseQuery(videosQuery());
  const [category, setCategory] = useState("All");
  const [term, setTerm] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(videos.map((v) => v.category))).sort()], [videos]);
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    return videos.filter(
      (v) =>
        (category === "All" || v.category === category) &&
        (!t || v.title.toLowerCase().includes(t) || v.description.toLowerCase().includes(t)),
    );
  }, [videos, category, term]);
  const featured = videos.filter((v) => v.is_featured).slice(0, 3);
  const showFeatured = category === "All" && !term && featured.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Video library"
        title="Every dive, every find."
        intro="Come along on our adventures. New videos go up on YouTube most days."
      >
        <Button asChild variant="forest" size="xl" className="mt-8">
          <a href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
            <Youtube aria-hidden /> Subscribe on YouTube
          </a>
        </Button>
      </PageHeader>

      {showFeatured && (
        <section className="container-page pt-16">
          <p className="eyebrow mb-6 text-clay">Featured</p>
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "border-forest bg-forest text-forest-foreground"
                    : "border-border bg-paper text-foreground/80 hover:border-forest hover:text-forest",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="relative block md:w-72">
            <span className="sr-only">Search videos</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search videos"
              className="h-11 w-full rounded-full border border-input bg-paper pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>
        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "video" : "videos"}
        </p>
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-lg text-muted-foreground">No videos match that search yet.</p>
        ) : (
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
