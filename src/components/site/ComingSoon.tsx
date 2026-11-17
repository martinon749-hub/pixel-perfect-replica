import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import { PageHeader } from "./sections";

export function ComingSoon({
  eyebrow,
  title,
  intro,
  points,
  image,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
  image?: string;
  aside?: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} image={image} />
      <section className="container-page grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            <span className="size-2 rounded-full bg-gold" aria-hidden /> Opening soon
          </p>
          <h2 className="mt-6 text-3xl md:text-4xl">What you'll be able to do here</h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-4 border-b border-border pb-4 text-lg text-foreground/85">
                <span className="rule-gold mt-3.5 shrink-0" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          {aside}
        </div>
        <aside className="h-fit rounded-2xl bg-forest-deep p-8 text-cream md:col-span-5">
          <p className="eyebrow text-gold">Be first to know</p>
          <h3 className="mt-3 text-2xl">We'll let you know the moment it opens.</h3>
          <NewsletterForm tone="dark" className="mt-6" />
          <Button asChild variant="link" className="mt-6 px-0 text-cream">
            <Link to="/finds">
              Browse our latest finds <ArrowRight aria-hidden />
            </Link>
          </Button>
        </aside>
      </section>
    </>
  );
}
