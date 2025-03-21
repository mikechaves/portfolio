"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = params

  // This would typically come from an API or database
  const posts = {
    "design-masters": {
      title: "My Journey in the Master of Design Program",
      date: "2024-03-15",
      readingTime: "5 min read",
      content: `
      <p>Pursuing a Master of Design in Experience Design at San Jose State University has been a transformative journey that has expanded my understanding of design thinking and user-centered approaches. As I approach graduation in May 2025, I wanted to reflect on some key insights from this educational experience.</p>
      
      <h2>Bridging Theory and Practice</h2>
      
      <p>One of the most valuable aspects of the program has been learning how to effectively bridge design theory with practical application. Through various projects and collaborations, I've developed a deeper understanding of how theoretical frameworks can inform real-world design decisions.</p>
      
      <p>The program's emphasis on research methodologies has equipped me with tools to approach design challenges more systematically, ensuring that solutions are grounded in user needs and behaviors rather than assumptions.</p>
      
      <h2>Expanding Design Horizons</h2>
      
      <p>Before entering the program, my design focus was primarily on digital interfaces. However, the curriculum has pushed me to explore experience design in a broader context, considering physical spaces, service design, and emerging technologies like AR/VR.</p>
      
      <p>This expanded perspective has been invaluable in my professional work, particularly in my role with Snap Inc's Spectacles team, where designing for augmented reality requires thinking beyond traditional screen-based interactions.</p>
      
      <h2>The Power of Critique and Collaboration</h2>
      
      <p>Perhaps the most growth-inducing aspect of the program has been the culture of critique and collaboration. Regular feedback sessions with professors and peers have challenged me to articulate my design decisions more clearly and to remain open to alternative perspectives.</p>
      
      <p>Collaborative projects have also reinforced the importance of diverse viewpoints in the design process. Working with classmates from various backgrounds has consistently led to more innovative and inclusive solutions than what I might have developed independently.</p>
      
      <h2>Looking Forward</h2>
      
      <p>As I continue in the program, I'm excited to further develop my thesis project, which explores the intersection of augmented reality and accessibility. The supportive environment at SJSU has encouraged me to pursue this research direction, which I believe has significant potential to make immersive technologies more inclusive.</p>
      
      <p>I look forward to sharing more insights from this journey as I progress toward graduation and beyond.</p>
    `,
    },
    "ar-future": {
      title: "The Future of AR in Everyday Life",
      date: "2024-02-22",
      readingTime: "7 min read",
      content: `
      <p>Augmented Reality (AR) is rapidly evolving from a novelty technology to an essential part of our daily lives. Through my work with Snap Inc's Spectacles and other AR initiatives, I've gained insights into how this technology is poised to transform our interactions with the world around us.</p>
      
      <h2>Beyond Entertainment</h2>
      
      <p>While AR's initial applications were heavily focused on entertainment and gaming (think Pokémon GO), we're now seeing the technology mature into practical tools for everyday use. From navigation overlays that guide you through unfamiliar cities to virtual measuring tools that help you shop for furniture, AR is becoming increasingly utilitarian.</p>
      
      <p>This shift represents a significant evolution in how we think about augmented reality—not just as a fun diversion but as an essential layer of information that enhances our understanding and interaction with the physical world.</p>
      
      <h2>The Social Dimension</h2>
      
      <p>One of the most exciting developments in AR is its potential to transform social interactions. Shared AR experiences allow people to collaborate in mixed reality environments, whether they're physically together or connecting remotely.</p>
      
      <p>Imagine attending a concert where AR enhances the visual experience for everyone wearing compatible glasses, or collaborating with colleagues on a 3D model that appears to float in the center of your conference table. These scenarios are rapidly becoming reality.</p>
      
      <h2>Challenges and Considerations</h2>
      
      <p>Despite its promise, AR faces several challenges that must be addressed for widespread adoption:</p>
      
      <ul>
        <li>Hardware limitations: Current AR glasses are still bulky and have limited battery life</li>
        <li>Privacy concerns: AR devices can potentially capture vast amounts of data about users and their surroundings</li>
        <li>Social acceptance: The normalization of wearing AR devices in public spaces will take time</li>
        <li>Accessibility: Ensuring AR experiences are accessible to people with various abilities remains a challenge</li>
      </ul>
      
      <h2>Designing for an Augmented Future</h2>
      
      <p>As designers, we have a responsibility to shape how AR integrates into daily life. This means creating experiences that are intuitive, unobtrusive, and genuinely useful rather than gimmicky.</p>
      
      <p>It also means considering the ethical implications of our designs. How might AR experiences affect users' perception of reality? How can we ensure that AR enhances rather than distracts from meaningful human connections?</p>
      
      <p>The future of AR is not just about technological advancement but about thoughtful integration into the human experience. As we continue to develop this technology, keeping users at the center of our design process will be more important than ever.</p>
    `,
    },
    "ux-principles": {
      title: "Essential UX Principles for Immersive Experiences",
      date: "2024-01-10",
      readingTime: "6 min read",
      content: `
      <p>As immersive technologies like AR and VR become more prevalent, designers face new challenges in creating intuitive and engaging user experiences. Based on my work in this field, here are some essential UX principles for designing effective immersive experiences.</p>
      
      <h2>1. Spatial Awareness</h2>
      
      <p>Unlike traditional 2D interfaces, immersive experiences exist in three-dimensional space. Good immersive design accounts for how users perceive and navigate this space. Consider factors like:</p>
      
      <ul>
        <li>Field of view: What can users see without turning their heads?</li>
        <li>Depth perception: How do users understand distance in virtual space?</li>
        <li>Physical comfort: How can you minimize strain from unusual head or body positions?</li>
      </ul>
      
      <p>Remember that users bring their real-world spatial expectations into virtual environments. Violating these expectations without good reason can lead to confusion and discomfort.</p>
      
      <h2>2. Natural Interaction Patterns</h2>
      
      <p>The most intuitive immersive experiences leverage familiar physical interactions. When possible, design interactions that mirror how users would interact with similar objects in the real world.</p>
      
      <p>For example, allowing users to "grab" virtual objects by closing their hand in a fist is more intuitive than requiring them to learn abstract button combinations. Similarly, placing important information at eye level rather than requiring users to look down constantly aligns with natural human behavior.</p>
      
      <h2>3. Clear Feedback Loops</h2>
      
      <p>In immersive environments, users need clear feedback to understand when their actions have been recognized by the system. This feedback should be:</p>
      
      <ul>
        <li>Multimodal: Combining visual, audio, and sometimes haptic feedback</li>
        <li>Immediate: Responding without perceptible delay</li>
        <li>Proportional: Matching the significance of the action</li>
      </ul>
      
      <p>Without proper feedback, users may repeat actions unnecessarily or become frustrated when the system doesn't respond as expected.</p>
      
      <h2>4. Progressive Disclosure</h2>
      
      <p>Immersive environments can quickly become overwhelming if too much information is presented simultaneously. Implement progressive disclosure by:</p>
      
      <ul>
        <li>Introducing features gradually as users need them</li>
        <li>Hiding advanced options until basic interactions are mastered</li>
        <li>Using spatial organization to separate primary and secondary information</li>
      </ul>
      
      <p>This approach helps users build mental models of the environment without cognitive overload.</p>
      
      <h2>5. Accessibility Considerations</h2>
      
      <p>Immersive experiences present unique accessibility challenges. Design with diverse users in mind by:</p>
      
      <ul>
        <li>Offering multiple interaction methods (gesture, voice, controller)</li>
        <li>Providing options for seated and standing experiences</li>
        <li>Considering users with different sensory abilities</li>
        <li>Testing with diverse user groups</li>
      </ul>
      
      <p>By applying these principles, we can create immersive experiences that feel natural, engaging, and accessible to a wide range of users. As the technology continues to evolve, our design approaches will undoubtedly refine, but keeping users at the center of our process will always remain essential.</p>
    `,
    },
    "team-leadership": {
      title: "Leading Creative Teams in Tech",
      date: "2023-12-18",
      readingTime: "8 min read",
      content: `
      <p>Leading teams at the intersection of design and technology presents unique challenges and opportunities. Through my experience managing creative teams, particularly in my current role with Snap Inc's Spectacles Accelerator Program, I've developed some insights on effective leadership in this space.</p>
      
      <h2>Balancing Structure and Creative Freedom</h2>
      
      <p>Creative teams need space to explore and experiment, but they also require clear direction and deadlines. Finding the right balance is crucial:</p>
      
      <ul>
        <li>Set clear objectives and constraints, but leave room for how those objectives are met</li>
        <li>Establish regular check-ins without micromanaging the creative process</li>
        <li>Create "sandbox" time where team members can explore ideas without immediate deliverable pressure</li>
      </ul>
      
      <p>I've found that the most innovative solutions often emerge when teams have both clear parameters and the freedom to explore within those boundaries.</p>
      
      <h2>Building Multidisciplinary Understanding</h2>
      
      <p>In technology-focused creative teams, members often come from diverse backgrounds—design, engineering, product management, research, and more. Effective leadership requires fostering mutual understanding across these disciplines:</p>
      
      <ul>
        <li>Encourage cross-disciplinary shadowing and knowledge sharing</li>
        <li>Develop a shared vocabulary that bridges technical and design concepts</li>
        <li>Help team members understand the constraints and priorities of other disciplines</li>
      </ul>
      
      <p>When designers understand technical limitations and engineers appreciate design principles, collaboration becomes more fluid and productive.</p>
      
      <h2>Creating Psychological Safety</h2>
      
      <p>Innovation requires risk-taking, which means team members need to feel safe sharing unpolished ideas and learning from failures:</p>
      
      <ul>
        <li>Model vulnerability by sharing your own works-in-progress and lessons from failures</li>
        <li>Separate idea generation from idea evaluation in team discussions</li>
        <li>Recognize and celebrate thoughtful risk-taking, even when outcomes aren't successful</li>
        <li>Address interpersonal tensions quickly and directly</li>
      </ul>
      
      <p>Teams that feel psychologically safe are more likely to propose innovative solutions and provide honest feedback on existing work.</p>
      
      <h2>Advocating for User-Centered Approaches</h2>
      
      <p>As a leader, one of your key responsibilities is ensuring that user needs remain central to the team's work, especially when business or technical pressures push in other directions:</p>
      
      <ul>
        <li>Regularly bring user research insights into team discussions</li>
        <li>Frame decisions in terms of user impact, not just technical elegance or business metrics</li>
        <li>Create opportunities for team members to observe or interact with users directly</li>
      </ul>
      
      <p>By consistently advocating for users, you help the team create products that are not just technically impressive but genuinely valuable to the people who use them.</p>
      
      <h2>Nurturing Growth and Development</h2>
      
      <p>Creative professionals are often deeply motivated by opportunities to develop their skills and tackle new challenges:</p>
      
      <ul>
        <li>Work with team members to identify their growth goals and create development plans</li>
        <li>Distribute project responsibilities to provide stretch opportunities</li>
        <li>Provide specific, actionable feedback that helps team members refine their craft</li>
        <li>Connect team members with mentors and learning resources in their areas of interest</li>
      </ul>
      
      <p>By investing in your team's growth, you not only improve retention but also enhance the team's collective capabilities over time.</p>
      
      <p>Leading creative teams in technology requires a thoughtful balance of structure and freedom, technical and design understanding, and business awareness and user advocacy. When these elements come together, teams can create truly innovative solutions that push the boundaries of what's possible.</p>
    `,
    },
  }

  const post = posts[id as keyof typeof posts]

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <article>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 glitch" data-text={post.title}>
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon size={14} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none prose-headings:text-primary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}

