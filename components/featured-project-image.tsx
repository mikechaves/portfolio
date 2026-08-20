import Image from "next/image"

interface FeaturedProjectImageProps {
  alt: string
  objectPosition: string
  src: string
}

export function FeaturedProjectImage({
  alt,
  objectPosition,
  src,
}: FeaturedProjectImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      style={{ objectPosition }}
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
    />
  )
}
