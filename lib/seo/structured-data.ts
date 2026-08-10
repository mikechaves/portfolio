import type { Post } from "@/types/post"
import type { ProjectDetail } from "@/types/project-detail"
import type { Project } from "@/types/project"
import {
  DEFAULT_DESCRIPTION,
  getAbsoluteUrl,
  getCanonicalUrl,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_SOCIAL_PROFILES,
} from "./site"

const PERSON_ID = `${SITE_ORIGIN}/#person`
const WEBSITE_ID = `${SITE_ORIGIN}/#website`

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        jobTitle: "AI-Native Design Engineer",
        sameAs: [...SITE_SOCIAL_PROFILES],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_ORIGIN,
        name: `${SITE_NAME} Portfolio`,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": PERSON_ID },
      },
    ],
  }
}

export function getProfilePageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${getCanonicalUrl("/about")}#profile-page`,
    url: getCanonicalUrl("/about"),
    name: `About ${SITE_NAME}`,
    description:
      "Mike Chaves's operating model, selected professional evidence, public practice, and contact information.",
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      jobTitle: "AI-Native Design Engineer",
      url: SITE_ORIGIN,
      sameAs: [...SITE_SOCIAL_PROFILES],
    },
  }
}

export function getProjectStructuredData(project: ProjectDetail) {
  const url = getCanonicalUrl(`/projects/${project.id}`)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        url,
        name: `${project.title} case study`,
        description: project.description,
        image: getAbsoluteUrl(project.image),
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        inLanguage: "en-US",
        keywords: project.technologies.join(", "),
        about: project.details.services ?? project.technologies,
        isPartOf: { "@id": WEBSITE_ID },
        sameAs: [project.demo, project.github, ...(project.links?.map((link) => link.url) ?? [])].filter(
          Boolean
        ),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: getCanonicalUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: getCanonicalUrl("/projects"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: url,
          },
        ],
      },
    ],
  }
}

export function getProjectCollectionStructuredData(projects: Project[]) {
  const url = getCanonicalUrl("/projects")
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "AI product, game, and design engineering projects",
    description:
      "Reviewed case studies spanning AI-native products, human-in-the-loop workflows, game and creator systems, XR accessibility, and interactive tools.",
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: getCanonicalUrl(`/projects/${project.id}`),
      })),
    },
  }
}

export function getBlogCollectionStructuredData(posts: Post[]) {
  const url = getCanonicalUrl("/blog")
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Writing on AI product design, XR accessibility, and interactive systems",
    description:
      "Article summaries and original writing by Mike Chaves about AI-native UX, emerging technology, and accessible spatial interaction.",
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: getCanonicalUrl(`/blog/${post.id}`),
      })),
    },
  }
}

export function getArticleStructuredData(post: Post) {
  const url = getCanonicalUrl(`/blog/${post.id}`)
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@id": PERSON_ID, "@type": "Person", name: SITE_NAME },
    publisher: { "@id": PERSON_ID, "@type": "Person", name: SITE_NAME },
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    sameAs: post.url,
  }
}
