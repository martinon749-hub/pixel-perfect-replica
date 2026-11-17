import { Link } from "@tanstack/react-router";
import logo from "@/assets/couple-of-dumpsters-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link to="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Couple of Dumpsters, home">
      <img
        src={logo.url}
        alt="Couple of Dumpsters — Rescue. Reuse. Reconnect."
        width={1920}
        height={641}
        className={cn("h-11 w-auto md:h-12", imgClassName)}
      />
    </Link>
  );
}

export const logoUrl = logo.url;
