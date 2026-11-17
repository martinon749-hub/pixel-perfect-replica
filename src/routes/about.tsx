import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Recycle, Users, Youtube } from "lucide-react";
import storyImg from "@/assets/story-hands-rescue.jpg";
import heroImg from "@/assets/hero-skip-treasures.jpg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/sections";
import { YOUTUBE_URL } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Amir & Ruth — Couple of Dumpsters" },
      {
        name: "description",
        content: "Meet Amir and Ruth, the British couple behind Couple of Dumpsters, rescuing good things from skips and giving them a second life.",
      },
      { property: "og:title", content: "About Amir & Ruth — Couple of Dumpsters" },
      { property: "og:description", content: "The story behind Couple of Dumpsters: rescue, reuse, reconnect." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Recycle,
    title: "Rescue",
    text: "We look in the skips behind shops and depots and pull out what's still good. Far more than you'd think.",
  },
  {
    icon: ArrowRight,
    title: "Reuse",
    text: "What we find gets used, sold on fairly, or passed on. The goal is simple: less in landfill.",
  },
  {
    icon: Users,
    title: "Reconnect",
    text: "Useful things belong with people who need them. We're building a community to make that easier.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Two people, a lot of skips, and a simple idea."
        intro="We're Amir and Ruth: the Couple of Dumpsters. We go treasure hunting in Britain's bins so good things don't go to waste."
        image={heroImg}
      />

      <section className="container-page grid gap-14 py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4 text-clay">How it started</p>
          <h2 className="text-4xl leading-[1.05] md:text-5xl">Finding treasure where others see trash.</h2>
          <div className="mt-8 space-y-5 text-lg text-foreground/80">
            <p>
              It started with curiosity: what do big shops actually throw away? The answer surprised us. Brand-new
              homeware, sealed clothes with tags still on, boxed toys, bathroom suites. Perfectly good things, heading
              for landfill.
            </p>
            <p>
              So we started filming. Every dive goes up on our YouTube channel, where you can come along for the
              adventure, the jackpots and the occasional run-in with security.
            </p>
            <p>
              What we don't keep, we pass on or donate. Now we're building this website so more of it reaches the
              people who need it, and so you can do the same with things you no longer need.
            </p>
          </div>
          <Button asChild variant="forest" size="xl" className="mt-10">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              <Youtube aria-hidden /> Watch us on YouTube
            </a>
          </Button>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <img
            src={storyImg}
            alt="Gloved hands lifting a floral teapot and boxed items out of a skip"
            width={1280}
            height={1600}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lift"
          />
        </div>
      </section>

      <section className="bg-forest-deep py-24 text-cream">
        <div className="container-page">
          <p className="eyebrow mb-4 text-gold">What we stand for</p>
          <h2 className="max-w-2xl text-4xl leading-[1.05] md:text-5xl">Rescue. Reuse. Reconnect.</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="border-t border-cream/20 pt-8">
                <v.icon className="size-6 text-gold" aria-hidden />
                <h3 className="mt-5 text-2xl">{v.title}</h3>
                <p className="mt-3 text-forest-foreground/75">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center">
        <h2 className="max-w-xl text-3xl md:text-4xl">See what we've rescued lately.</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="forest" size="xl">
            <Link to="/finds">
              Our finds <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="quiet" size="xl">
            <Link to="/charity-community">Charity &amp; Community</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
