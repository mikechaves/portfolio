import {
  getContentRelationshipIssues,
  getRelatedArticlesForProject,
  getRelatedProjectsForArticle,
} from "@/lib/content-relationships"
import { posts } from "@/lib/posts"

describe("content relationships", () => {
  it("references only public articles and projects", () => {
    expect(getContentRelationshipIssues()).toEqual([])
  })

  it("gives every article summary contextual project evidence", () => {
    for (const post of posts) {
      const relationships = getRelatedProjectsForArticle(post.id)
      expect(relationships.length).toBeGreaterThanOrEqual(2)
      expect(relationships.every((relationship) => relationship.reason.length > 40)).toBe(true)
    }
  })

  it("keeps project-to-article relationships bidirectional", () => {
    for (const post of posts) {
      for (const project of getRelatedProjectsForArticle(post.id)) {
        expect(getRelatedArticlesForProject(project.projectId)).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ articleId: post.id }),
          ])
        )
      }
    }
  })
})
