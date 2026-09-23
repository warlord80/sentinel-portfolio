import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.author.name} — ${site.author.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: "60px",
            height: "4px",
            background: "#C99A4A",
            marginBottom: "32px",
            borderRadius: "2px",
          }}
        />
        {/* Name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#F3F1EB",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          {site.author.name}
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#C99A4A",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          {site.author.jobTitle}
        </div>
        {/* Description */}
        <div
          style={{
            fontSize: "20px",
            color: "#AAA7A0",
            maxWidth: "800px",
            lineHeight: 1.5,
          }}
        >
          Threat Detection · SIEM · Incident Response · Security Operations
        </div>
      </div>
    ),
    { ...size },
  );
}
