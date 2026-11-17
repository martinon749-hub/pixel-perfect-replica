import { createFileRoute } from "@tanstack/react-router";
import communityImg from "@/assets/community-donations-hall.jpg";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/charity-donations")({
  head: () => ({
    meta: [
      { title: "Charity Donations — Couple of Dumpsters" },
      { name: "description", content: "Registered charities will be able to request free items donated by Couple of Dumpsters. Charity registration is opening soon." },
      { property: "og:title", content: "Charity Donations — Couple of Dumpsters" },
      { property: "og:description", content: "Registered charities will be able to request free items donated by Couple of Dumpsters. Charity registration is opening soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="For charities"
      title="Free items for registered charities."
      intro="We donate many of the things we rescue. Soon, registered charities will be able to sign up and request items for the people they support."
      image={communityImg}
      points={[
        "Register your organisation; we verify every charity before approval.",
        "Browse items we have set aside to donate, and request what you can use.",
        "Explain how items will be used and arrange collection or delivery.",
        "Track your requests and donation history from your charity dashboard.",
      ]}
    />
  ),
});
