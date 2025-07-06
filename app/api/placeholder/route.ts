import { NextResponse } from "next/server"

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const width = parseInt(searchParams.get("width") || "", 10) || 600
  const height = parseInt(searchParams.get("height") || "", 10) || 400
  const rawText = searchParams.get("text") ?? "No Image"
  const text = rawText.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
  const fontSize = Math.floor(Math.min(width, height) / 10)
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
      <rect width='100%' height='100%' fill='#e5e5e5'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            fill='#666' font-family='Arial, sans-serif' font-size='${fontSize}'>${text}</text>
    </svg>
  `
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  })
}
