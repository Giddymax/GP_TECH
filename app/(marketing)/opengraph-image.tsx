import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const heights = [0.3, 0.55, 0.75, 1, 0.75, 0.55, 0.3];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#13242e",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(43,179,185,0.35) 0%, rgba(19,36,46,0) 45%), radial-gradient(circle at 85% 0%, rgba(0,86,114,0.6) 0%, rgba(19,36,46,0) 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#66d4d8",
            fontWeight: 600,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            fontWeight: 700,
            color: "#f6f9fa",
            marginTop: 28,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <span>Whatever you run,</span>
          <span style={{ color: "#66d4d8" }}>run it digital.</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 56, alignItems: "flex-end" }}>
          {heights.map((h, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: h * 90,
                borderRadius: 4,
                backgroundColor: i % 3 === 0 ? "#13242e" : "#2bb3b9",
                opacity: 0.5 + h * 0.5,
                border: i % 3 === 0 ? "2px solid #2bb3b9" : "none",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
