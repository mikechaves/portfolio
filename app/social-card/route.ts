import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_PROPERTIES } from "@/lib/seo/site"

export const dynamic = "force-static"

// Keep existing share-image URLs useful when a crawler refreshes cached metadata.
export async function GET() {
  const image = await readFile(join(process.cwd(), "public", DEFAULT_SOCIAL_IMAGE))
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": DEFAULT_SOCIAL_IMAGE_PROPERTIES.type },
  })
}
