import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/site/cards";
import { videoQuery, videosQuery } from "@/lib/content.queries";
import { formatDate, youtubeThumb } from "@/lib/site";

export const Route = createFileRoute("/videos/$videoId")({
  loader: async ({ context, params }) => {
    const video = await context.queryClient.ensureQueryData(videoQuery(params.videoId));
    if (!video) throw notFound();
    await context.queryClient.ensureQueryData(videosQuery(7));
    return { title: video.title, description: video.description, youtubeId: video.youtube_id };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Video unavailable — Couple of Dumpsters" }, { name: "robots", content: "noindex" }] };
    const desc = loaderData.description.slice(0, 155) || "A Couple of Dumpsters video.";
    const img = youtubeThumb(loaderData.youtubeId);
    return {
      meta: [
        { title: `${loaderData.title} — Couple of Dumpsters` },
        { name: "description", content: desc },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "video.other" },
        { property: "og:image", content: img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: img },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-4xl">Video not found</h1>
      <p className="mt-4 text-muted-foreground">It may have been removed or the link is incorrect.</p>
      <Button asChild variant="forest" className="mt-8 rounded-full">
        <Link to="/videos">Back to all videos</Link>
      </Button>
    </div>
  ),
  component: VideoPage,
});

function VideoPage() {
  const { videoId } = Route.useParams();
  const { data: video } = useSuspenseQuery(videoQuery(videoId));
  const { data: recent } = useSuspenseQuery(videosQuery(7));
  if (!video) return null;
  const more = recent.filter((v) => v.youtube_id !== video.youtube_id).slice(0, 6);

  return (
    <>
      <section className="bg-forest-deep pt-8 pb-16 text-cream">
        <div className="container-page">
          <Link to="/videos" className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold">
            <ArrowLeft className="size-4" aria-hidden /> All videos
          </Link>
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl bg-charcoal shadow-lift">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?rel=0`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>
      <section className="container-page grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="forest">{video.category}</Badge>
            <span className="text-sm text-muted-foreground">{formatDate(video.published_at)}</span>
          </div>
          <h1 className="mt-4 text-3xl leading-tight md:text-4xl">{video.title}</h1>
          {video.description && (
            <div className="mt-6 space-y-4 text-lg whitespace-pre-line text-foreground/80">{video.description}</div>
          )}
          <Button asChild variant="quiet" className="mt-8 rounded-full">
            <a href={`https://www.youtube.com/watch?v=${video.youtube_id}`} target="_blank" rel="noopener noreferrer">
              <Youtube aria-hidden /> Watch and comment on YouTube
            </a>
          </Button>
        </div>
        <aside className="lg:col-span-4">
          <p className="eyebrow mb-6 text-clay">More videos</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {more.slice(0, 3).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
