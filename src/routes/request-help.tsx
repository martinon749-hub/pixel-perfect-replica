import { createFileRoute } from "@tanstack/react-router";
import communityImg from "@/assets/community-donations-hall.jpg";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/request-help")({
  head: () => ({
    meta: [
      { title: "Request Help — Couple of Dumpsters" },
      { name: "description", content: "If there is something you genuinely need, tell Couple of Dumpsters about it. If we find something suitable, we may be able to help." },
      { property: "og:title", content: "Request Help — Couple of Dumpsters" },
      { property: "og:description", content: "If there is something you genuinely need, tell Couple of Dumpsters about it. If we find something suitable, we may be able to help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Request help"
      title="Need a helping hand?"
      intro="If there is something you genuinely need, tell us about it. If we find something suitable, we may be able to help."
      image={communityImg}
      points={[
        "A short, simple form: your name, how to reach you, your area and what you need.",
        "No bank details, ID documents or sensitive information required.",
        "A reference number so you can follow up with us.",
        "We review every request personally. We cannot promise to help everyone, but we will try to match what we can.",
      ]}
    />
  ),
});
