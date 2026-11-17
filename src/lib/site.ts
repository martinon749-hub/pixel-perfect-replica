export const SITE_NAME = "Couple of Dumpsters";
export const YOUTUBE_URL = "https://www.youtube.com/@CoupleofDumpsters";
export const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@CoupleofDumpsters?sub_confirmation=1";

export type NavItem = { label: string; to: string; description?: string };

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

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", to: "/legal/privacy" },
  { label: "Cookie Policy", to: "/legal/cookies" },
  { label: "Terms & Conditions", to: "/legal/terms" },
  { label: "Returns & Refunds", to: "/legal/returns" },
  { label: "Shipping Policy", to: "/legal/shipping" },
  { label: "Auction Terms", to: "/legal/auction-terms" },
  { label: "Charity Donation Terms", to: "/legal/charity-donation-terms" },
  { label: "Community Donation Terms", to: "/legal/community-donation-terms" },
];

export const youtubeThumb = (id: string, quality: "maxresdefault" | "hqdefault" | "mqdefault" = "maxresdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })
    : "";
