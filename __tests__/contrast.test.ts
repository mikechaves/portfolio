import fs from 'fs';
import { hex as contrastHex } from 'wcag-contrast';

function parseColors(block: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const regex = /--([a-z0-9-]+):\s*([^;]+);/gi;
  let m;
  while ((m = regex.exec(block))) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  const to255 = (n: number) => Math.round((n + m) * 255);
  return `#${to255(r).toString(16).padStart(2, '0')}${to255(g).toString(16).padStart(2, '0')}${to255(b).toString(16).padStart(2, '0')}`;
}

function convert(value: string): string {
  if (value.startsWith('#')) {
    return value.toLowerCase();
  }
const match =
  // First, try to match the flexible hsl(H S L) or hsl(H, S, L) format
  value.match(/^hsl\(\s*([0-9.]+)\s*,?\s*([0-9.]+)%\s*,?\s*([0-9.]+)%\s*\)$/) ||
  
  // If that fails, try to match the space-separated H S L format
  value.match(/^([0-9.]+)\s+([0-9.]+)%\s+([0-9.]+)%$/); 
  
  if (!match) {
    throw new Error(`Unable to parse color: ${value}`);
  }
  return hslToHex(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
}

const css = fs.readFileSync('styles/globals.css', 'utf8');
const rootMatch = /:root\s*{([^}]*)}/.exec(css);
const darkMatch = /\.dark\s*{([^}]*)}/.exec(css);
if (!rootMatch || !darkMatch) {
  throw new Error('Unable to find color blocks');
}

const rootColors = parseColors(rootMatch[1]);
const darkColors = parseColors(darkMatch[1]);

const pairs: Record<string, string> = {
  foreground: 'background',
  'card-foreground': 'card',
  'popover-foreground': 'popover',
  'primary-foreground': 'primary',
  'secondary-foreground': 'secondary',
  'muted-foreground': 'muted',
  'accent-foreground': 'accent',
  'destructive-foreground': 'destructive',
  'sidebar-foreground': 'sidebar-background',
  'sidebar-primary-foreground': 'sidebar-primary',
  'sidebar-accent-foreground': 'sidebar-accent',
};

function checkPairs(colors: Record<string, string>) {
  for (const [fg, bg] of Object.entries(pairs)) {
    if (!(fg in colors) || !(bg in colors)) continue;
    const ratio = contrastHex(convert(colors[fg]), convert(colors[bg]));
    expect(ratio).toBeGreaterThanOrEqual(3);
  }
}

test('light theme color contrast', () => {
  checkPairs(rootColors);
});

test('dark theme color contrast', () => {
  checkPairs(darkColors);
});

test('convert parses hsl formats', () => {
  expect(convert('240 5.9% 10%')).toBe('#18181b');
  expect(convert('hsl(43 74% 66%)')).toBe('#e8c468');
  expect(convert('hsl(43,74%,66%)')).toBe('#e8c468');
});

test('convert lowercases hex strings', () => {
  expect(convert('#ABCDEF')).toBe('#abcdef');
});

test.each([
  ['not-a-color'],
  ['hsl(invalid)'],
  ['1 2 3'], // missing '%'
  [''], // empty string
])('convert throws on invalid color string "%s"', (color) => {
  expect(() => convert(color)).toThrow(`Unable to parse color: ${color}`);
});
