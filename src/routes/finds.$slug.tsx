import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Play } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FindCard } from "@/components/site/cards";
import { discoveriesQuery, discoveryQuery } from "@/lib/content.queries";
import { formatDate, youtubeThumb } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finds/$slug")({
  loader: async ({ context, params }) => {
    const find = await context.queryClient.ensureQueryData(discoveryQuery(params.slug));
    if (!find) throw notFound();
    await context.queryClient.ensureQueryData(discoveriesQuery({ limit: 4 }));
    return { title: find.title, summary: find.summary, image: find.image_urls[0] ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Find unavailable — Couple of Dumpsters" }, { name: "robots", content: "noindex" }] };
    const meta = [
      { title: `${loaderData.title} — Our Finds — Couple of Dumpsters` },
      { name: "description", content: loaderData.summary },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.summary },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-4xl">Find not found</h1>
      <p className="mt-4 text-muted-foreground">It may have been removed or the link is incorrect.</p>
      <Button asChild variant="forest" className="mt-8 rounded-full">
        <Link to="/finds">Back to all finds</Link>
      </Button>
    </div>
  ),
  component: FindPage,
});

const statusText = { sold: "Sold", donated: "Donated", kept: "Kept", other: null } as const;

function FindPage() {
  const { slug } = Route.useParams();
  const { data: find } = useSuspenseQuery(discoveryQuery(slug));
  const { data: others } = useSuspenseQuery(discoveriesQuery({ limit: 4 }));
  const [active, setActive] = useState(0);
  if (!find) return null;
  const images = find.image_urls.length ? find.image_urls : find.video_youtube_id ? [youtubeThumb(find.video_youtube_id)] : [];
  const status = statusText[find.status];
  const related = others.filter((o) => o.id !== find.id).slice(0, 3);

  return (
    <>
      <section className="container-page pt-8 pb-16">
        <Link to="/finds" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-forest">
          <ArrowLeft className="size-4" aria-hidden /> All finds
        </Link>
        <div className="mt-6 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {images[active] && (
              <img
                src={images[active]}
                alt={find.title}
                width={1280}
                height={720}
                className="aspect-[4/3] w-full rounded-2xl bg-muted object-cover shadow-lift"
              />
            )}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={cn("overflow-hidden rounded-lg border-2", i === active ? "border-forest" : "border-transparent")}
                  >
                    <img src={src} alt="" className="h-20 w-28 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="forest">{find.category}</Badge>
              {status && <Badge variant="gold">{status}</Badge>}
              {find.condition && <Badge variant="outline">{find.condition}</Badge>}
            </div>
            <h1 className="mt-5 text-4xl leading-[1.05] md:text-5xl">{find.title}</h1>
            {find.found_on && <p className="mt-3 text-sm text-muted-foreground">Found {formatDate(find.found_on)}</p>}
            <p className="mt-6 text-lg whitespace-pre-line text-foreground/80">{find.story || find.summary}</p>
            {find.estimated_value_gbp != null && (
              <div className="mt-8 rounded-xl border border-border bg-paper p-5">
                <p className="eyebrow text-clay">Our rough estimate</p>
                <p className="mt-1 font-display text-3xl">
                  £{Number(find.estimated_value_gbp).toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  An informal guess, not a verified market price or valuation.
                </p>
              </div>
            )}
            {find.video_youtube_id && (
              <Button asChild variant="forest" size="xl" className="mt-8">
                <Link to="/videos/$videoId" params={{ videoId: find.video_youtube_id }}>
                  <Play className="fill-current" aria-hidden /> Watch the video
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="border-t border-border bg-paper py-16">
          <div className="container-page">
            <h2 className="text-3xl">More finds</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((f) => (
                <FindCard key={f.id} find={f} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
