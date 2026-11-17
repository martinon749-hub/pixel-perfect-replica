import type { LinkProps } from "@tanstack/react-router";

export const SITE_NAME = "Couple of Dumpsters";
export const YOUTUBE_URL = "https://www.youtube.com/@CoupleofDumpsters";
export const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@CoupleofDumpsters?sub_confirmation=1";

export type AppPath = NonNullable<LinkProps["to"]>;
export type NavItem = { label: string; to: AppPath; description?: string };

export const mainNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Videos", to: "/videos" },
  { label: "Our Finds", to: "/finds" },
  { label: "Shop", to: "/shop" },
  { label: "Auctions", to: "/auctions" },
];

export const communityNav: NavItem[] = [
  { label: "Charity & Community", to: "/charity-community", description: "How we give things a second life" },
  { label: "Request Help", to: "/request-help", description: "Tell us about something you genuinely need" },
  { label: "Donate an Item", to: "/donate-an-item", description: "Give something you no longer need a new home" },
  { label: "Find Free Items", to: "/community-donations", description: "Browse free items from the community" },
  { label: "Charity Donations", to: "/charity-donations", description: "For registered charities" },
];

export const legalPages = [
  { label: "Privacy Policy", slug: "privacy" },
  { label: "Cookie Policy", slug: "cookies" },
  { label: "Terms & Conditions", slug: "terms" },
  { label: "Returns & Refunds", slug: "returns" },
  { label: "Shipping Policy", slug: "shipping" },
  { label: "Auction Terms", slug: "auction-terms" },
  { label: "Charity Donation Terms", slug: "charity-donation-terms" },
  { label: "Community Donation Terms", slug: "community-donation-terms" },
] as const;

export const youtubeThumb = (id: string, quality: "maxresdefault" | "hqdefault" | "mqdefault" = "maxresdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })
    : "";
