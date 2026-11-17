import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className={cn("eyebrow mb-4", dark ? "text-gold" : "text-clay")}>{eyebrow}</p>}
        <h2 className={cn("text-4xl leading-[1.05] md:text-5xl", dark ? "text-cream" : "text-foreground")}>{title}</h2>
        {intro && (
          <p className={cn("mt-4 text-lg", dark ? "text-forest-foreground/75" : "text-muted-foreground")}>{intro}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  if (image) {
    return (
      <section className="relative isolate overflow-hidden bg-forest-deep text-cream">
        <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-page py-24 md:py-32">
          {eyebrow && <p className="eyebrow mb-5 text-gold animate-rise">{eyebrow}</p>}
          <h1 className="max-w-3xl text-5xl leading-[1.02] md:text-7xl animate-rise">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg text-cream/85 md:text-xl animate-rise">{intro}</p>}
          {children}
        </div>
      </section>
    );
  }
  return (
    <section className="border-b border-border bg-paper">
      <div className="container-page py-16 md:py-24">
        {eyebrow && <p className="eyebrow mb-5 text-clay">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl leading-[1.02] text-foreground md:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
