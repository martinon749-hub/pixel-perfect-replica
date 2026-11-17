import { queryOptions } from "@tanstack/react-query";
import { getDiscovery, getVideo, listDiscoveries, listVideos } from "./content.functions";

export const videosQuery = (limit?: number) =>
  queryOptions({ queryKey: ["videos", { limit }], queryFn: () => listVideos({ data: { limit } }), staleTime: 60_000 });

export const videoQuery = (youtubeId: string) =>
  queryOptions({ queryKey: ["video", youtubeId], queryFn: () => getVideo({ data: { youtubeId } }), staleTime: 60_000 });

export const discoveriesQuery = (opts: { limit?: number; featured?: boolean } = {}) =>
  queryOptions({
    queryKey: ["discoveries", opts],
    queryFn: () => listDiscoveries({ data: opts }),
    staleTime: 60_000,
  });

export const discoveryQuery = (slug: string) =>
  queryOptions({ queryKey: ["discovery", slug], queryFn: () => getDiscovery({ data: { slug } }), staleTime: 60_000 });
