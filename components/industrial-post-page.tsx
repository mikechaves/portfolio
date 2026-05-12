import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Post } from "@/types/post"

type IndustrialPostPageProps = {
  post: Post
  preview: string[]
}

function getPostImageSrc(src: string) {
  try {
    const url = new URL(src, "http://portfolio.local")
    url.searchParams.set("width", "1200")
    url.searchParams.set("height", "700")

    if (url.origin === "http://portfolio.local") {
      return `${url.pathname}${url.search}${url.hash}`
    }

    return url.toString()
  } catch {
    return src
  }
}

export function IndustrialPostPage({ post, preview }: IndustrialPostPageProps) {
  const postImageSrc = getPostImageSrc(post.image)

  return (
    <article className="industrial-page">
      <Link href="/blog" className="industrial-text-link !mt-0">
        <ArrowLeft size={14} /> Back to writing
      </Link>
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="industrial-page-kicker">{post.publication}</p>
          <h1 className="industrial-page-title">{post.title}</h1>
          <p className="industrial-page-intro">{post.excerpt}</p>
          <div className="industrial-meta">
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="industrial-button industrial-button-primary mt-8">
            Read on Medium <ArrowRight size={16} />
          </a>
        </div>
        <div className="industrial-card-media m-0 min-h-[24rem]">
          <Image
            src={postImageSrc}
            alt={post.title}
            fill
            className="object-cover grayscale"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      </div>
      <div className="industrial-rule" />
      <section className="industrial-card max-w-3xl">
        <h2 className="text-3xl font-black uppercase text-[#f1ede3]">Article Preview</h2>
        <div className="mt-6 grid gap-5">
          {preview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </article>
  )
}
