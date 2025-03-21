import { BlogCard } from "@/components/blog-card"

export default function BlogPage() {
  const posts = [
    {
      id: "design-masters",
      title: "My Journey in the Master of Design Program",
      excerpt: "Reflections on pursuing a Master of Design in Experience Design at San Jose State University.",
      date: "2024-03-15",
      readingTime: "5 min read",
    },
    {
      id: "ar-future",
      title: "The Future of AR in Everyday Life",
      excerpt: "How augmented reality is evolving from novelty to necessity in our daily interactions.",
      date: "2024-02-22",
      readingTime: "7 min read",
    },
    {
      id: "ux-principles",
      title: "Essential UX Principles for Immersive Experiences",
      excerpt: "Key design considerations when creating user experiences that transcend traditional interfaces.",
      date: "2024-01-10",
      readingTime: "6 min read",
    },
    {
      id: "team-leadership",
      title: "Leading Creative Teams in Tech",
      excerpt: "Lessons learned from managing teams at the intersection of design and technology.",
      date: "2023-12-18",
      readingTime: "8 min read",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">blog_posts.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-4">
            <span className="text-primary">$</span> ls -la /articles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}

