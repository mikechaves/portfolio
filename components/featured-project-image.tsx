interface FeaturedProjectImageProps {
  alt: string
  height: number
  objectPosition: string
  src: string
  width: number
}

export function FeaturedProjectImage({
  alt,
  height,
  objectPosition,
  src,
  width,
}: FeaturedProjectImageProps) {
  return (
    <div className="home-featured-image">
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized static assets avoid runtime image billing */}
      <img
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        data-home-featured-src={src}
        className="home-featured-native-image"
        style={{ objectPosition }}
      />
    </div>
  )
}
