import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-skip-treasures.jpg";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Couple of Dumpsters" },
      { name: "description", content: "Rescued items from our dumpster dives, checked, fairly priced and posted across the UK. The Couple of Dumpsters shop is opening soon." },
      { property: "og:title", content: "Shop — Couple of Dumpsters" },
      { property: "og:description", content: "Rescued items from our dumpster dives, checked, fairly priced and posted across the UK. The Couple of Dumpsters shop is opening soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="The shop"
      title="Rescued finds, ready for a new home."
      intro="We are preparing our online shop for items discovered on our dives. Every item will be described honestly, with its condition clearly shown."
      image={heroImg}
      points={[
        "Browse rescued electronics, homeware, clothing, toys, collectibles and vintage finds.",
        "See honest condition grades, from New to For Parts or Repair.",
        "Pay securely and track your order from your account.",
        "Have items posted anywhere in the UK, with prices in pounds sterling.",
      ]}
    />
  ),
});
