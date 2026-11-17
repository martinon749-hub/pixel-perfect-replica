import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/auctions")({
  head: () => ({
    meta: [
      { title: "Auctions — Couple of Dumpsters" },
      { name: "description", content: "Bid on the most unusual Couple of Dumpsters finds in real, timed online auctions. Opening soon." },
      { property: "og:title", content: "Auctions — Couple of Dumpsters" },
      { property: "og:description", content: "Bid on the most unusual Couple of Dumpsters finds in real, timed online auctions. Opening soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Auctions"
      title="Our rarest finds, under the hammer."
      intro="Some finds are too unusual to price. We are building proper timed auctions so you can bid on them fairly."
      points={[
        "Real auctions with a starting bid, minimum increments and a live countdown.",
        "Every bid checked on our side, so nobody can bid late or too low.",
        "Last-minute bids extend the clock, so the fastest finger does not always win.",
        "Winners are notified and can pay securely from their account.",
      ]}
    />
  ),
});
