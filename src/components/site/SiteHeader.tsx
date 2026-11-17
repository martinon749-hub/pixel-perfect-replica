import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Youtube } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { communityNav, mainNav, YOUTUBE_URL } from "@/lib/site";
import { Logo } from "./Logo";

const linkBase =
  "relative px-3 py-2 text-[0.9rem] font-medium text-foreground/80 transition-colors hover:text-forest data-[status=active]:text-forest";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center lg:flex">
          {mainNav.map((item) => (
            <Link key={item.to} to={item.to} className={linkBase} activeOptions={{ exact: item.to === "/" }}>
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={`${linkBase} inline-flex items-center gap-1 outline-none`}>
              Charity &amp; Community <ChevronDown className="size-3.5" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              {communityNav.map((item) => (
                <DropdownMenuItem key={item.to} asChild className="cursor-pointer rounded-md p-3">
                  <Link to={item.to} className="flex flex-col items-start gap-0.5">
                    <span className="font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/contact" className={linkBase}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="forest" size="sm" className="hidden rounded-full px-4 sm:inline-flex">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              <Youtube aria-hidden /> Watch
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto bg-paper">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo imgClassName="h-10" />
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-2 flex flex-col px-4 pb-8">
                {[...mainNav, { label: "Contact", to: "/contact" as const }].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    className="border-b border-border py-3.5 font-display text-xl text-foreground data-[status=active]:text-forest"
                  >
                    {item.label}
                  </Link>
                ))}
                <p className="eyebrow mt-8 mb-2 text-clay">Charity &amp; Community</p>
                {communityNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="py-2.5 text-base text-foreground/85 data-[status=active]:font-semibold data-[status=active]:text-forest"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild variant="forest" size="xl" className="mt-8">
                  <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                    <Youtube aria-hidden /> Watch on YouTube
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
