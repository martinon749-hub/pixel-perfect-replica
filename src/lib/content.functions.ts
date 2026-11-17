import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicClient } from "./supabase-public.server";

export type Video = {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  category: string;
  published_at: string;
  is_featured: boolean;
};

export type Discovery = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  story: string;
  category: string;
  condition: string | null;
  estimated_value_gbp: number | null;
  image_urls: string[];
  video_youtube_id: string | null;
  status: "sold" | "donated" | "kept" | "other";
  location: string | null;
  found_on: string | null;
  is_featured: boolean;
};

const VIDEO_COLS = "id, youtube_id, title, description, category, published_at, is_featured";
const DISCOVERY_COLS =
  "id, slug, title, summary, story, category, condition, estimated_value_gbp, image_urls, video_youtube_id, status, location, found_on, is_featured";

export const listVideos = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ limit: z.number().int().min(1).max(200).optional() }).parse(d ?? {}))
  .handler(async ({ data }): Promise<Video[]> => {
    const sb = createPublicClient();
    let q = sb.from("videos").select(VIDEO_COLS).order("published_at", { ascending: false });
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as Video[];
  });

export const getVideo = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ youtubeId: z.string().regex(/^[A-Za-z0-9_-]{6,20}$/) }).parse(d))
  .handler(async ({ data }): Promise<Video | null> => {
    const sb = createPublicClient();
    const { data: row, error } = await sb.from("videos").select(VIDEO_COLS).eq("youtube_id", data.youtubeId).maybeSingle();
    if (error) throw new Error(error.message);
    return (row as Video | null) ?? null;
  });

export const listDiscoveries = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ limit: z.number().int().min(1).max(200).optional(), featured: z.boolean().optional() }).parse(d ?? {}),
  )
  .handler(async ({ data }): Promise<Discovery[]> => {
    const sb = createPublicClient();
    let q = sb.from("discoveries").select(DISCOVERY_COLS).order("found_on", { ascending: false, nullsFirst: false });
    if (data.featured) q = q.eq("is_featured", true);
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as Discovery[];
  });

export const getDiscovery = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().regex(/^[a-z0-9-]{1,120}$/) }).parse(d))
  .handler(async ({ data }): Promise<Discovery | null> => {
    const sb = createPublicClient();
    const { data: row, error } = await sb.from("discoveries").select(DISCOVERY_COLS).eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return (row as Discovery | null) ?? null;
  });
