import { BlogCard } from "@/components/blog-card"

export default function BlogPage() {
  const posts = [
    {
      id: "embracing-ambiguity",
      title: "Embracing Ambiguity: Finding Clarity in the Chaos of Modern Technology",
      excerpt:
        "Navigating the complex landscape of emerging technologies and finding meaningful solutions amid uncertainty.",
      date: "Feb 12, 2025",
      readingTime: "6 min read",
      url: "https://medium.com/design-bootcamp/embracing-ambiguity-finding-clarity-in-the-chaos-of-modern-technology-415e5834e150",
      image: "/placeholder.svg?height=400&width=600",
      publication: "Bootcamp",
      featured: true,
    },
    {
      id: "ai-becomes-user",
      title: "When AI Becomes the User: Redefining UX/UI for the Future",
      excerpt: "Exploring how AI as a user changes our approach to interface design and user experience strategies.",
      date: "Jan 28, 2025",
      readingTime: "7 min read",
      url: "https://medium.com/design-bootcamp/when-ai-becomes-the-user-redefining-ux-ui-for-the-future-ac6bbc6eb084",
      image: "/placeholder.svg?height=400&width=600",
      publication: "Bootcamp",
      featured: false,
    },
    {
      id: "extended-pausabilities",
      title: "Extended Pausabilities: Navigating XR with Accessibility in Mind",
      excerpt: "How to design inclusive extended reality experiences that work for users of all abilities.",
      date: "Dec 15, 2024",
      readingTime: "8 min read",
      url: "https://medium.com/design-bootcamp/extended-pausabilities-navigating-xr-with-accessibility-in-mind-1fa35fb4d590",
      image: "/placeholder.svg?height=400&width=600",
      publication: "Bootcamp",
      featured: false,
    },
    {
      id: "redefining-reality",
      title: "Redefining Reality: The Future of Design in XR",
      excerpt:
        "How extended reality is transforming design principles and creating new possibilities for immersive experiences.",
      date: "Nov 30, 2024",
      readingTime: "6 min read",
      url: "https://medium.com/design-bootcamp/redefining-reality-the-future-of-design-in-xr-a5e053e255a8",
      image: "/placeholder.svg?height=400&width=600",
      publication: "Bootcamp",
      featured: false,
    },
  ]

  return (
    <div className="space-y-8 pt-8">
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

      <section>
        <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  )
}

