import { ImageResponse } from "next/og"
import { posts } from "@/lib/posts"

const size = { width: 1200, height: 630 }

interface ArticleCardRouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: ArticleCardRouteContext) {
  const { id } = await params
  const post = posts.find((item) => item.id === id)
  if (!post) return new Response("Article not found", { status: 404 })

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
          padding: "72px 82px",
          fontFamily: "monospace",
          border: "2px solid #27272a",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#ff2bd6" }}>{post.publication}</span>
          <span style={{ color: "#a1a1aa" }}>{post.date}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1030 }}>
          <div
            style={{
              display: "flex",
              fontSize: post.title.length > 64 ? 56 : 64,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 27,
              lineHeight: 1.4,
              color: "#d4d4d8",
            }}
          >
            {post.excerpt}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            color: "#71717a",
          }}
        >
          <span>MIKE CHAVES / WRITING</span>
          <span style={{ color: "#00ff8c" }}>MIKECHAVES.IO</span>
        </div>
      </div>
    ),
    size
  )
}
