import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, HandHeart, Package, Search } from "lucide-react";
import communityImg from "@/assets/community-donations-hall.jpg";
import { PageHeader } from "@/components/site/sections";
import type { AppPath } from "@/lib/site";

export const Route = createFileRoute("/charity-community")({
  head: () => ({
    meta: [
      { title: "Charity & Community — Couple of Dumpsters" },
      {
        name: "description",
        content:
          "Request help, donate an item, find free things or register your charity. Giving useful things a second life in our community.",
      },
      { property: "og:title", content: "Charity & Community — Couple of Dumpsters" },
      { property: "og:description", content: "Giving things a second life. Making a real difference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CharityCommunity,
});

const paths: { letter: string; icon: typeof HandHeart; title: string; text: string; cta: string; to: AppPath; tone: string }[] = [
  {
    letter: "A",
    icon: HandHeart,
    title: "Request Help",
    text: "If there's something you genuinely need, tell us. If we find something suitable, we may be able to help.",
    cta: "Ask for help",
    to: "/request-help",
    tone: "bg-paper",
  },
  {
    letter: "B",
    icon: Package,
    title: "Donate an Item",
    text: "Don't throw it away. List something you no longer need and give it a new home, completely free.",
    cta: "Donate an item",
    to: "/donate-an-item",
    tone: "bg-secondary",
  },
  {
    letter: "C",
    icon: Search,
    title: "Find Free Items",
    text: "Browse free things donated by people in the community and request what you need.",
    cta: "Find free items",
    to: "/community-donations",
    tone: "bg-accent",
  },
  {
    letter: "D",
    icon: Building2,
    title: "Charity Donations",
    text: "Registered charities can request items we've set aside to donate, for the people they support.",
    cta: "For charities",
    to: "/charity-donations",
    tone: "bg-muted",
  },
];

function CharityCommunity() {
  return (
    <>
      <PageHeader
        eyebrow="Charity & Community"
        title="Giving things a second life. Making a real difference."
        intro="Whether you need something, have something to give, or represent a charity, there is a place for you in our community."
        image={communityImg}
      />
      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {paths.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border p-8 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-lift md:p-10 ${p.tone}`}
            >
              <span className="absolute top-6 right-8 font-display text-7xl text-forest/10" aria-hidden>
                {p.letter}
              </span>
              <p.icon className="size-8 text-forest" aria-hidden />
              <h2 className="mt-6 text-3xl">{p.title}</h2>
              <p className="mt-3 max-w-md text-lg text-foreground/75">{p.text}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-forest">
                {p.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-paper py-16">
        <div className="container-page grid gap-8 md:grid-cols-3">
          <Note title="Always free" text="Nothing in Charity & Community is for sale. No bids, no fees, no commissions." />
          <Note title="Your privacy first" text="Home addresses and contact details are never shown publicly." />
          <Note title="Checked by us" text="We review every listing and request ourselves before anything is shared." />
        </div>
      </section>
    </>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <span className="rule-gold block" aria-hidden />
      <h3 className="mt-4 text-xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}
