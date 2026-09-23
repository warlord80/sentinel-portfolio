// ──────────────────────────────────────────────────────────────────
// Centralized site configuration — single source of truth for URLs,
// metadata, and structured data. All pages reference this module
// instead of hard-coding the production URL.
// ──────────────────────────────────────────────────────────────────

function normalizeUrl(raw: string | undefined): string {
  const base = (raw || "https://chibuike-nwozor.vercel.app").replace(/\/+$/, "");
  return base;
}

export const site = {
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  title: "Chibuike Nwozor",
  titleTemplate: "%s | Chibuike Nwozor",
  description:
    "Chibuike Nwozor is a Cybersecurity Analyst and SOC Analyst in Nigeria focused on threat detection, SIEM monitoring, incident response, security operations, network security, and cloud security.",
  shortDescription:
    "Cybersecurity Analyst and SOC Analyst specializing in threat detection, SIEM, incident response, and security operations.",
  ogImage: "/opengraph-image",
  locale: "en_NG",
  type: "website" as const,
  author: {
    name: "Chibuike Nwozor",
    jobTitle: "Cybersecurity Analyst / SOC Analyst",
    email: "chibuikenwozor@gmail.com",
    location: "Nigeria",
    url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  },
  social: {
    linkedin: "https://linkedin.com/in/chibuike-nwozor",
    x: "https://x.com/youravgtechdude",
    whatsapp: "https://wa.me/2348157159802",
  },
  knowsAbout: [
    "SOC operations",
    "threat detection",
    "SIEM",
    "Splunk",
    "incident response",
    "network security",
    "cloud security",
    "detection engineering",
    "log analysis",
    "vulnerability management",
    "cybersecurity",
  ],
} as const;
