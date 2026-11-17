import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Discovery, Video } from "@/lib/content.functions";
import { formatDate, youtubeThumb } from "@/lib/site";
import { cn } from "@/lib/utils";

export function VideoCard({ video, size = "md" }: { video: Video; size?: "md" | "lg" }) {
  return (
    <Link
      to="/videos/$videoId"
      params={{ videoId: video.youtube_id }}
      className="group flex flex-col gap-4 focus-visible:outline-none"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted shadow-soft">
        <img
          src={youtubeThumb(video.youtube_id, size === "lg" ? "maxresdefault" : "hqdefault")}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-card-overlay opacity-60 transition-opacity group-hover:opacity-80" />
        <span className="absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-full bg-cream/95 text-forest shadow-soft transition-transform group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-gold">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden />
        </span>
        <Badge variant="cream" className="absolute top-3 left-3">
          {video.category}
        </Badge>
      </div>
      <div>
        <h3
          className={cn(
            "font-display leading-snug text-foreground transition-colors group-hover:text-forest",
            size === "lg" ? "text-2xl" : "text-lg",
          )}
        >
          {video.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{formatDate(video.published_at)}</p>
      </div>
    </Link>
  );
}

const statusLabel: Record<Discovery["status"], string | null> = {
  sold: "Sold",
  donated: "Donated",
  kept: "Kept",
  other: null,
};

export function FindCard({ find, className }: { find: Discovery; className?: string }) {
  const img = find.image_urls[0] ?? (find.video_youtube_id ? youtubeThumb(find.video_youtube_id) : undefined);
  const status = statusLabel[find.status];
  return (
    <Link
      to="/finds/$slug"
      params={{ slug: find.slug }}
      className={cn("group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-soft transition-shadow hover:shadow-lift", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {img && (
          <img
            src={img}
            alt={find.title}
            width={1280}
            height={720}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        {status && (
          <Badge variant="gold" className="absolute top-3 right-3">
            {status}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-clay">{find.category}</p>
        <h3 className="mt-2 font-display text-xl leading-snug text-foreground group-hover:text-forest">{find.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{find.summary}</p>
      </div>
    </Link>
  );
}
