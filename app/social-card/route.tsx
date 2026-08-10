import { ImageResponse } from "next/og"

const size = { width: 1200, height: 630 }

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#ffffff",
          padding: "76px 84px",
          fontFamily: "monospace",
          border: "2px solid #1f2937",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 23,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          <span>AI-Native Product Systems</span>
          <span style={{ color: "#00ff8c" }}>Reviewed Evidence / Online</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Mike Chaves<span style={{ color: "#00ff8c" }}>_</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              maxWidth: 930,
              fontSize: 34,
              lineHeight: 1.35,
              color: "#d4d4d8",
            }}
          >
            Design engineering for AI workflows, game and creator systems, and immersive interfaces.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <span>MIKECHAVES.IO</span>
          <span style={{ color: "#00ff8c" }}>HUMAN INTENT → OPERATIONAL REALITY</span>
        </div>
      </div>
    ),
    size
  )
}
