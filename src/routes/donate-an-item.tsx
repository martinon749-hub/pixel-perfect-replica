import { createFileRoute } from "@tanstack/react-router";
import communityImg from "@/assets/community-donations-hall.jpg";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/donate-an-item")({
  head: () => ({
    meta: [
      { title: "Donate an Item — Couple of Dumpsters" },
      { name: "description", content: "Don't throw it away, give it a new home. Donate things you no longer need to people and charities in your community, completely free." },
      { property: "og:title", content: "Donate an Item — Couple of Dumpsters" },
      { property: "og:description", content: "Don't throw it away, give it a new home. Donate things you no longer need to people and charities in your community, completely free." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Donate an item"
      title="Don't throw it away. Give it a new home."
      intro="Something you no longer need could make a real difference to someone else. Share it, donate it, and help give it a second life."
      image={communityImg}
      points={[
        "Add a photo, a short description and the condition. No account needed.",
        "Your exact address and contact details stay private.",
        "We check every listing before it goes live.",
        "Choose whether you pick the recipient, or let us help decide.",
        "Completely free: no selling, bidding or fees in this section.",
      ]}
    />
  ),
});
