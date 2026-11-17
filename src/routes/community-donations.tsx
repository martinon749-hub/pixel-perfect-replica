import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/community-donations")({
  head: () => ({
    meta: [
      { title: "Find Free Items — Couple of Dumpsters" },
      { name: "description", content: "Browse free items donated by people in the community, ready to collect. Couple of Dumpsters community donations are opening soon." },
      { property: "og:title", content: "Find Free Items — Couple of Dumpsters" },
      { property: "og:description", content: "Browse free items donated by people in the community, ready to collect. Couple of Dumpsters community donations are opening soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Find free items"
      title="Free things, from people near you."
      intro="Soon you will be able to browse items your neighbours no longer need and request them for free."
      points={[
        "Search by item, category, town or postcode.",
        "See photos, condition and the rough area for collection.",
        "Request an item with a short note about why you need it.",
        "If you are chosen, you will receive the pickup details privately.",
      ]}
    />
  ),
});
