import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { getProjectBySlug } from "@/app/actions/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = project?.title || "Project";
  const category = project?.category || "";

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
        <div
          style={{
            width: "60px",
            height: "4px",
            background: "#C99A4A",
            marginBottom: "32px",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            fontSize: "48px",
            fontWeight: 600,
            color: "#F3F1EB",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {category && (
          <div
            style={{
              fontSize: "18px",
              color: "#C99A4A",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            {category}
          </div>
        )}
        <div
          style={{
            fontSize: "16px",
            color: "#AAA7A0",
          }}
        >
          {site.author.name} · {site.author.jobTitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
