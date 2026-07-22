# Preview QA Checklist

Use this checklist before merging portfolio changes that touch homepage motion, project cards,
project detail media, navigation, or global styling.

## Required Routes

- Run `pnpm check:links` before browser QA.
- Use `pnpm check:links -- --check-external` when you want a non-blocking HTTP status report
  for external project, writing, and social links.
- `/`
- `/projects`
- `/projects/wizzo`
- `/projects/x-games`
- `/projects/geovoice`
- `/projects/creative-supply-engine`
- `/projects/vulnerability-visualizer`
- `/projects/speakeasy`
- `/about#professional-experience`

## Viewports

- Desktop: `1280 x 720` or wider.
- Mobile: `390 x 844`.
- Check that `document.documentElement.scrollWidth <= window.innerWidth` after accounting for
  browser scrollbar behavior.

## Homepage WebGL And Motion

- The homepage WebGL canvas renders only as decorative content and remains `aria-hidden`.
- The default homepage tab order does not include Metaverse-only controls.
- `Enter Metaverse` remains the only path into Snow Crash-inspired theatrical effects.
- Reduced-motion users do not get typing delays, hover glitch animation, pulsing badges, or card
  lift animation.
- No console errors or framework overlays are present.

## Project Media

- The primary project media appears once in the main viewer, not duplicated in the thumbnail rail.
- Primary above-the-fold project media uses Next image priority.
- Supporting thumbnails keep stable aspect ratios on desktop and mobile.
- Fullscreen media has visible label/caption context, not image-only chrome.
- Arrow keys move through fullscreen media only while the modal is open and there is more than one
  artifact.
- `Escape` and the close button dismiss fullscreen media.

## Contrast And Focus

- Inputs have programmatic labels, not placeholder-only names.
- Filter buttons expose pressed state.
- Project cards, filter chips, media thumbnails, modal controls, and external CTAs all have visible
  focus rings.
- Text overlays remain readable against project imagery.

## Image Asset Rules

- Treat project screenshots over `1.5 MB` as optimization candidates unless they are source evidence
  that must remain high fidelity.
- Prefer committed JPG/WebP screenshots for photographic or rendered UI evidence.
- Keep PNG for screenshots that need crisp UI text or transparency.
- Use section-adjacent evidence strips for supporting artifacts, not repeated hero thumbnails.
- Do not add generated screenshots or QA captures to the repo unless they are intentional portfolio
  media.
