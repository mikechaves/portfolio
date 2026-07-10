import "server-only"

import OpenAI from "openai"

let openAIClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null
  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openAIClient
}

export function resetOpenAIClientForTests(): void {
  openAIClient = null
}
