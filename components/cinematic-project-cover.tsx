const covers: Record<string, { src: string; alt: string; caption: string; width: number; height: number }> = {
  wizzo: { src: '/projects/wizzo/celestial-identity.webp', alt: 'Wizzo celestial identity with Wisp in a moonlit observatory', caption: 'Wizzo · Celestial identity and character direction', width:1730,height:909 },
  'x-games': { src:'/projects/x-games/generated-game-detail.webp',alt:'Playfold catalog and playable stories',caption:'Playfold · Interactive storytelling and game discovery',width:1600,height:900 },
  speakeasy: { src:'/projects/speakeasy/thesis-defense.webp',alt:'Mike presenting his SpeakEasy thesis',caption:'SpeakEasy · Voice-driven AI for inclusive XR',width:4032,height:3024 },
}

export function CinematicProjectCover({projectId}:{projectId:string}) {
  const cover=covers[projectId]
  if (!cover) return null
  return <figure className={`cinematic-project-cover cinematic-project-cover--${projectId}`}>
    <div data-art-plane>
      {/* eslint-disable-next-line @next/next/no-img-element -- committed, optimized real project art */}
      <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height}
        srcSet={`/visuals/night-frequency/${projectId === "x-games" ? "playfold" : projectId}-mobile.webp ${projectId === "wizzo" ? 800 : 480}w, /visuals/night-frequency/${projectId === "x-games" ? "playfold" : projectId}.webp ${projectId === "wizzo" ? 1200 : 760}w, ${cover.src} ${cover.width}w`}
        sizes="(max-width: 700px) calc(100vw - 44px), 90vw"
        loading="lazy" decoding="async" data-project-art />
      <span className="art-fallback" aria-hidden="true">{projectId === 'x-games' ? 'Playfold' : projectId === 'wizzo' ? 'Wizzo' : 'SpeakEasy'}</span>
    </div><figcaption>{cover.caption}</figcaption>
  </figure>
}
