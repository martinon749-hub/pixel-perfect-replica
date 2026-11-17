export type LegalPage = { title: string; summary: string; sections: { heading: string; body: string }[] };

// Draft placeholder wording. Must be reviewed and replaced before the site goes live.
export const legalContent: Record<string, LegalPage> = {
  privacy: {
    title: "Privacy Policy",
    summary: "How Couple of Dumpsters collects, uses and protects your personal information.",
    sections: [
      { heading: "Who we are", body: "This website is run by Couple of Dumpsters (Amir and Ruth). Our full contact details will be added here." },
      { heading: "What we collect", body: "We only collect what we need: for example your name and email when you contact us or sign up to our newsletter, and the details you give us when you use our community features." },
      { heading: "How we use it", body: "To reply to you, send emails you have asked for, and run the services on this website. We never sell your information." },
      { heading: "Your rights", body: "Under UK data protection law you can ask to see, correct or delete your information at any time. Contact us to make a request." },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    summary: "How this website uses cookies and similar technologies.",
    sections: [
      { heading: "Essential cookies", body: "We use a small number of cookies needed for the website to work, such as keeping you signed in." },
      { heading: "Embedded videos", body: "Videos are embedded from YouTube in privacy-enhanced mode. YouTube may set cookies when you play a video." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    summary: "The terms that apply when you use the Couple of Dumpsters website.",
    sections: [
      { heading: "Using this website", body: "By using this website you agree to these terms. Please use it lawfully and respectfully." },
      { heading: "Sales, auctions and donations", body: "Commercial sales, paid auctions, free donations by Couple of Dumpsters and free donations by community members are separate services, each with their own terms." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    summary: "Our approach to returns and refunds for items bought in our shop.",
    sections: [
      { heading: "Your rights", body: "Your statutory rights as a UK consumer are not affected. Full returns details will be published before the shop opens." },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    summary: "How and where we post items bought from our shop.",
    sections: [{ heading: "Delivery", body: "Shipping options, costs and timescales will be published before the shop opens." }],
  },
  "auction-terms": {
    title: "Auction Terms",
    summary: "The rules for bidding in Couple of Dumpsters auctions.",
    sections: [
      { heading: "Bidding", body: "Each bid is a commitment to buy if you win. Full auction rules, including payment deadlines, will be published before auctions open." },
    ],
  },
  "charity-donation-terms": {
    title: "Charity Donation Terms",
    summary: "Terms for registered charities requesting items donated by Couple of Dumpsters.",
    sections: [
      { heading: "Eligibility", body: "Only charities we have verified can request donated items. We decide how limited items are allocated." },
    ],
  },
  "community-donation-terms": {
    title: "Community Donation Terms",
    summary: "Terms for giving and receiving free items through our community donations.",
    sections: [
      { heading: "Always free", body: "Community donations are completely free. Selling, bidding or asking for payment is not allowed." },
      { heading: "Safety and privacy", body: "Exact pickup addresses are only shared with the selected recipient. Please take sensible precautions when arranging collection." },
    ],
  },
};
