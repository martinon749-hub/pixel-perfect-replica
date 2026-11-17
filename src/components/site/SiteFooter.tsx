import { Link } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import { communityNav, legalPages, mainNav, SITE_NAME, YOUTUBE_URL, type NavItem } from "@/lib/site";
import { logoUrl } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-forest-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src={logoUrl} alt={SITE_NAME} width={1920} height={641} loading="lazy" className="h-14 w-auto" />
          <p className="mt-6 max-w-sm text-forest-foreground/75">
            One person's trash, another person's treasure. Follow Amir and Ruth as they rescue, reuse and reconnect.
          </p>
          <div className="mt-8 max-w-md">
            <p className="eyebrow mb-3 text-gold">Newsletter</p>
            <NewsletterForm tone="dark" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          <FooterCol title="Explore" items={[...mainNav, { label: "Contact", to: "/contact" }]} />
          <FooterCol title="Community" items={communityNav} />
          <div>
            <p className="eyebrow mb-4 text-gold">Policies</p>
            <ul className="space-y-2.5">
              {legalPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/legal/$slug"
                    params={{ slug: p.slug }}
                    className="text-sm text-forest-foreground/75 transition-colors hover:text-cream"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-forest-foreground/10">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-sm text-forest-foreground/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Made in the UK.</p>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-forest-foreground/80 hover:text-gold"
          >
            <Youtube className="size-4" aria-hidden /> @CoupleofDumpsters
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="eyebrow mb-4 text-gold">{title}</p>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="text-sm text-forest-foreground/75 transition-colors hover:text-cream">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
