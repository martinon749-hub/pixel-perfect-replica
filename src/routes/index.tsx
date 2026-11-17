import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Gavel, HandHeart, Gift, Package, ShoppingBag, Youtube, Search } from "lucide-react";
import heroImg from "@/assets/hero-skip-treasures.jpg";
import storyImg from "@/assets/story-hands-rescue.jpg";
import communityImg from "@/assets/community-donations-hall.jpg";
import { Button } from "@/components/ui/button";
import { FindCard, VideoCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/site/sections";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { logoUrl } from "@/components/site/Logo";
import { discoveriesQuery, videosQuery } from "@/lib/content.queries";
import { YOUTUBE_SUBSCRIBE_URL, YOUTUBE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Couple of Dumpsters — One Person's Trash, Another Person's Treasure" },
      {
        name: "description",
        content:
          "Join Amir and Ruth on British dumpster-diving adventures. Watch the videos, explore our finds and help give useful things a second life.",
      },
      { property: "og:title", content: "Couple of Dumpsters — One Person's Trash, Another Person's Treasure" },
      {
        property: "og:description",
        content: "British treasure hunting, rescued finds and a community giving things a second life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(videosQuery(6)),
      context.queryClient.ensureQueryData(discoveriesQuery({ limit: 6 })),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: videos } = useSuspenseQuery(videosQuery(6));
  const { data: finds } = useSuspenseQuery(discoveriesQuery({ limit: 6 }));
  const [lead, ...rest] = videos;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-forest-deep text-cream">
        <img
          src={heroImg}
          alt="Rescued vintage chair, brass lamp and mirror beside a red skip in a cobbled British lane"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-page flex min-h-[88vh] flex-col justify-end pt-24 pb-16 md:pb-24">
          <img
            src={logoUrl}
            alt="Couple of Dumpsters"
            width={1920}
            height={641}
            className="mb-10 h-20 w-auto self-start drop-shadow-xl md:h-28 animate-rise"
          />
          <h1 className="max-w-4xl text-5xl leading-[0.98] sm:text-6xl md:text-8xl animate-rise">
            One Person's Trash.{" "}
            <em className="font-normal text-gold">Another Person's Treasure.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-cream/85 md:text-xl animate-rise">
            Discover the unexpected, rescue forgotten treasures, give useful things a second life, and make a
            difference in our community.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-rise">
            <Button asChild variant="gold" size="xl">
              <Link to="/finds">
                Explore Our Finds <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/videos">
                <Youtube aria-hidden /> Watch Our Videos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured discoveries */}
      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Featured discoveries"
          title="Recently rescued"
          intro="Real finds from our latest dives, straight from the skip."
          action={
            <Button asChild variant="quiet" className="rounded-full">
              <Link to="/finds">
                All finds <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {finds.slice(0, 6).map((f) => (
            <FindCard key={f.id} find={f} />
          ))}
        </div>
      </section>

      {/* Latest videos */}
      <section className="bg-paper py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Latest from YouTube"
            title="Fresh from the channel"
            action={
              <Button asChild variant="forest" className="rounded-full">
                <a href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
                  <Youtube aria-hidden /> Subscribe
                </a>
              </Button>
            }
          />
          {lead && (
            <div className="mt-12 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <VideoCard video={lead} size="lg" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-6">
                {rest.slice(0, 2).map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-12">
            <Button asChild variant="link" className="px-0 text-base">
              <Link to="/videos">
                Browse the full video library <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop / auctions / free items — coming soon */}
      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Coming soon"
          title="Take home a piece of the adventure"
          intro="We're getting our shop, auctions and free community listings ready. Sign up below to hear when each one opens."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <TeaserCard
            icon={<ShoppingBag aria-hidden />}
            title="The Shop"
            text="Rescued items, checked and priced fairly, sent anywhere in the UK."
            to="/shop"
          />
          <TeaserCard
            icon={<Gavel aria-hidden />}
            title="Auctions"
            text="Bid on our most unusual finds in real, timed auctions."
            to="/auctions"
          />
          <TeaserCard
            icon={<Gift aria-hidden />}
            title="Free Items"
            text="Free things given by people in the community, ready to collect."
            to="/community-donations"
          />
        </div>
      </section>

      {/* Charity mission */}
      <section className="relative isolate overflow-hidden bg-forest-deep py-24 text-cream">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 text-gold">Charity &amp; Community</p>
            <h2 className="text-4xl leading-[1.05] md:text-5xl">
              Giving things a second life. Making a real difference.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-forest-foreground/80">
              Whether you need something, have something to give, or represent a charity, there is a place for you in
              our community.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <PathLink to="/request-help" icon={<HandHeart aria-hidden />} label="Request help" />
              <PathLink to="/donate-an-item" icon={<Package aria-hidden />} label="Donate an item" />
              <PathLink to="/community-donations" icon={<Search aria-hidden />} label="Find free items" />
              <PathLink to="/charity-donations" icon={<Gift aria-hidden />} label="Charity donations" />
            </div>
          </div>
          <div className="relative">
            <img
              src={communityImg}
              alt="Donated blankets, toys, kitchenware and a laptop laid out on tables in a community hall"
              width={1600}
              height={1072}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="container-page grid items-center gap-14 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <img
            src={storyImg}
            alt="Gloved hands lifting a floral teapot and boxed items out of a skip"
            width={1280}
            height={1600}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lift"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow mb-4 text-clay">Our story</p>
          <h2 className="text-4xl leading-[1.05] md:text-5xl">Finding treasure where others see trash.</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            We're Amir and Ruth. We go out across the UK to see what gets thrown away, and we film every dive. Far
            too much of it is perfectly good. What we rescue gets reused, passed on or donated, so less ends up in
            landfill.
          </p>
          <Button asChild variant="forest" size="xl" className="mt-8">
            <Link to="/about">
              Read our story <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* Newsletter + socials */}
      <section className="border-t border-border bg-paper py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3 text-clay">Stay in the loop</p>
            <h2 className="text-3xl md:text-4xl">New finds, new videos, straight to your inbox.</h2>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-forest hover:underline"
            >
              <Youtube className="size-5" aria-hidden /> youtube.com/@CoupleofDumpsters
            </a>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

function TeaserCard({ icon, title, text, to }: { icon: React.ReactNode; title: string; text: string; to: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-paper p-8 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-lift"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-forest [&_svg]:size-5">
        {icon}
      </span>
      <h3 className="mt-6 text-2xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest">
        Opening soon <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

function PathLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-cream/15 bg-cream/5 px-5 py-4 transition-colors hover:border-gold hover:bg-cream/10"
    >
      <span className="flex items-center gap-3 font-semibold [&_svg]:size-5 [&_svg]:text-gold">
        {icon} {label}
      </span>
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
