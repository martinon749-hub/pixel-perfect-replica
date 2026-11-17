import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FindCard } from "@/components/site/cards";
import { PageHeader } from "@/components/site/sections";
import { discoveriesQuery } from "@/lib/content.queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finds/")({
  head: () => ({
    meta: [
      { title: "Our Finds — Couple of Dumpsters" },
      {
        name: "description",
        content: "The most surprising things Amir and Ruth have rescued from Britain's skips, with the story behind each find.",
      },
      { property: "og:title", content: "Our Finds — Couple of Dumpsters" },
      { property: "og:description", content: "Real treasures rescued from Britain's skips, and the stories behind them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(discoveriesQuery()),
  component: FindsPage,
});

function FindsPage() {
  const { data: finds } = useSuspenseQuery(discoveriesQuery());
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(finds.map((f) => f.category))).sort()], [finds]);
  const list = category === "All" ? finds : finds.filter((f) => f.category === category);
  const [lead, ...rest] = list;

  return (
    <>
      <PageHeader
        eyebrow="Our finds"
        title="Rescued from the skip."
        intro="Some of the things we've found on our dives, and the stories behind them. Every find links to the video it came from."
      />
      <section className="container-page py-16">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6" role="group" aria-label="Filter by category">
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
        {!lead ? (
          <p className="py-20 text-center text-lg text-muted-foreground">No finds in this category yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FindCard find={lead} className="md:col-span-2 lg:row-span-2" />
            {rest.map((f) => (
              <FindCard key={f.id} find={f} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
