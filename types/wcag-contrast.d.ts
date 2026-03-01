declare module 'wcag-contrast' {
  export function hex(color1: string, color2: string): number;
  export function rgb(color1: [number, number, number], color2: [number, number, number]): number;
}
