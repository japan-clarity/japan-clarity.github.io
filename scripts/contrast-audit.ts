/**
 * Japan Clarity — WCAG 2.2 AA contrast audit for the museum light theme
 * (Scheme A). Computes contrast ratios for every deployed token pairing
 * (text on surfaces, interactive states, chart series on paper, focus ring)
 * and emits a machine-readable PASS/FAIL table.
 *
 * Run: bun run scripts/contrast-audit.ts
 * Thresholds: 4.5:1 normal text; 3:1 large text (≥24px, or ≥18.66px bold);
 *             3:1 meaningful non-text UI boundaries (focus ring, chart series).
 */

/** sRGB channel → linear-light component (WCAG relative luminance). */
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function ratio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Alpha compositing of `fg` over `bg` in sRGB (browser rgba blending). */
function blend(fg: string, alpha: number, bg: string): string {
  const p = (h: string) => [0, 2, 4].map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16));
  const [fr, fgG, fb] = p(fg);
  const [br, bgG, bb] = p(bg);
  const mix = (a: number, b: number) => Math.round(a * alpha + b * (1 - alpha));
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(mix(fr, br))}${to2(mix(fgG, bgG))}${to2(mix(fb, bb))}`;
}

interface Check {
  name: string;
  fg: string;
  bg: string;
  threshold: number;
  kind: "text" | "large-text" | "non-text";
}

// Deployed Scheme A tokens (globals.css)
const T = {
  page: "#F6F2EA",
  muted: "#EEE7DC",
  section: "#E7DED1",
  paper: "#FFFCF7",
  ink: "#2B2B2B",
  ink2: "#5C5A57",
  celadon: "#4E685E", // interactive (text-safe)
  gold: "#735C38", // text-safe kuchiba
  bluegrey: "#54626F", // text-safe blue-grey
  goldDecor: "#B89A6A",
  primaryFg: "#FFFCF7",
  tooltipBg: "#2B2B2B",
  tooltipText: "#F6F2EA",
  destructive: "#9E4A44",
  ring: "#4E685E",
  border: "#CFC6B8",
  inputStrong: "#A99B87",
  uncertainty: "#6B655C",
  series: ["#4E685E", "#96784A", "#6C7B8B", "#9C5F50", "#7B948C", "#7A7265", "#8C8274"],
};

// Blended surfaces actually produced by Tailwind opacity utilities
const heroWash = blend(T.muted, 0.6, T.page); // bg-block/60 over page
const raisedSection = blend(T.muted, 0.4, T.page); // bg-block/40 over page
const calloutBg = blend(T.muted, 0.5, T.page); // bg-block/50 over page
const heroPanel = blend(T.paper, 0.8, heroWash); // bg-surface/80 over hero wash
const tealTintOnPaper = blend(T.celadon, 0.1, T.paper); // bg-teal/10 badge
const goldTintOnPaper = blend(T.gold, 0.1, T.paper); // bg-sand/10 badge / projection note (renders on paper panels)
const cardOnWash = blend(T.paper, 0.7, blend(T.muted, 0.3, T.page)); // bg-surface/70 card over bg-block/30 section
const goldTintOnCard = blend(T.gold, 0.1, cardOnWash); // in-progress badge on home chapter cards
const hoverWash = blend(T.section, 0.6, T.paper); // hover:bg-accent/60 on cards

const checks: Check[] = [
  // Core text on every deployed surface
  { name: "ink body text on page", fg: T.ink, bg: T.page, threshold: 4.5, kind: "text" },
  { name: "ink body text on muted", fg: T.ink, bg: T.muted, threshold: 4.5, kind: "text" },
  { name: "ink body text on paper", fg: T.ink, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "ink body text on section", fg: T.ink, bg: T.section, threshold: 4.5, kind: "text" },
  { name: "secondary text on page", fg: T.ink2, bg: T.page, threshold: 4.5, kind: "text" },
  { name: "secondary text on muted", fg: T.ink2, bg: T.muted, threshold: 4.5, kind: "text" },
  { name: "secondary text on paper", fg: T.ink2, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "secondary text on section", fg: T.ink2, bg: T.section, threshold: 4.5, kind: "text" },
  { name: "secondary text on hero wash (bg-block/60)", fg: T.ink2, bg: heroWash, threshold: 4.5, kind: "text" },
  { name: "secondary text on raised section (bg-block/40)", fg: T.ink2, bg: raisedSection, threshold: 4.5, kind: "text" },
  // Interactive accent (links, eyebrows, active states) on every surface
  { name: "celadon link text on page", fg: T.celadon, bg: T.page, threshold: 4.5, kind: "text" },
  { name: "celadon link text on muted", fg: T.celadon, bg: T.muted, threshold: 4.5, kind: "text" },
  { name: "celadon link text on paper", fg: T.celadon, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "celadon link text on section", fg: T.celadon, bg: T.section, threshold: 4.5, kind: "text" },
  { name: "celadon eyebrow on hero wash", fg: T.celadon, bg: heroWash, threshold: 4.5, kind: "text" },
  { name: "celadon eyebrow on raised section", fg: T.celadon, bg: raisedSection, threshold: 4.5, kind: "text" },
  // Gold / blue-grey accent text (badges, labels)
  { name: "kuchiba gold text on page", fg: T.gold, bg: T.page, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on muted", fg: T.gold, bg: T.muted, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on paper", fg: T.gold, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on section", fg: T.gold, bg: T.section, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on hero wash", fg: T.gold, bg: heroWash, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on gold tint over paper (projection note)", fg: T.gold, bg: goldTintOnPaper, threshold: 4.5, kind: "text" },
  { name: "kuchiba gold text on gold tint on card (in-progress badge)", fg: T.gold, bg: goldTintOnCard, threshold: 4.5, kind: "text" },
  { name: "blue-grey text on page", fg: T.bluegrey, bg: T.page, threshold: 4.5, kind: "text" },
  { name: "blue-grey text on muted", fg: T.bluegrey, bg: T.muted, threshold: 4.5, kind: "text" },
  { name: "blue-grey text on paper", fg: T.bluegrey, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "blue-grey text on section", fg: T.bluegrey, bg: T.section, threshold: 4.5, kind: "text" },
  // Callout labels on callout surface
  { name: "celadon callout label on callout bg", fg: T.celadon, bg: calloutBg, threshold: 4.5, kind: "text" },
  { name: "gold callout label on callout bg", fg: T.gold, bg: calloutBg, threshold: 4.5, kind: "text" },
  { name: "blue-grey callout label on callout bg", fg: T.bluegrey, bg: calloutBg, threshold: 4.5, kind: "text" },
  { name: "uncertainty label on callout bg", fg: T.uncertainty, bg: calloutBg, threshold: 4.5, kind: "text" },
  { name: "secondary text on callout bg", fg: T.ink2, bg: calloutBg, threshold: 4.5, kind: "text" },
  // Hero sparkline panel (bg-surface/80 over hero wash) — inline SVG labels
  { name: "sparkline year label on hero panel", fg: T.ink2, bg: heroPanel, threshold: 4.5, kind: "text" },
  { name: "sparkline peak label (gold) on hero panel", fg: T.gold, bg: heroPanel, threshold: 4.5, kind: "text" },
  { name: "sparkline last-value label (celadon) on hero panel", fg: T.celadon, bg: heroPanel, threshold: 4.5, kind: "text" },
  // Buttons, pills, toggles
  { name: "primary button text on celadon fill", fg: T.primaryFg, bg: T.celadon, threshold: 4.5, kind: "text" },
  { name: "language-switch active pill text", fg: T.primaryFg, bg: T.celadon, threshold: 4.5, kind: "text" },
  { name: "language-switch inactive text on paper pill", fg: T.ink2, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "range-filter active text on celadon", fg: T.primaryFg, bg: T.celadon, threshold: 4.5, kind: "text" },
  { name: "range-filter inactive text on paper panel", fg: T.ink2, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "link text on hover wash (accent/60)", fg: T.ink, bg: hoverWash, threshold: 4.5, kind: "text" },
  // Status / verification badges (tint backgrounds)
  { name: "published badge text on celadon tint", fg: T.celadon, bg: tealTintOnPaper, threshold: 4.5, kind: "text" },
  { name: "provisional badge text on gold tint", fg: T.gold, bg: goldTintOnPaper, threshold: 4.5, kind: "text" },
  // Tooltip (ink museum label)
  { name: "tooltip text on ink tooltip", fg: T.tooltipText, bg: T.tooltipBg, threshold: 4.5, kind: "text" },
  // Destructive / error states
  { name: "destructive text on paper", fg: T.destructive, bg: T.paper, threshold: 4.5, kind: "text" },
  { name: "destructive text on page", fg: T.destructive, bg: T.page, threshold: 4.5, kind: "text" },
  // Headline (large text ≥24px) — 3:1 threshold
  { name: "ink heading on page (large text)", fg: T.ink, bg: T.page, threshold: 3, kind: "large-text" },
  { name: "ink heading on hero wash (large text)", fg: T.ink, bg: heroWash, threshold: 3, kind: "large-text" },
  // Non-text UI boundaries (3:1)
  { name: "focus ring vs page", fg: T.ring, bg: T.page, threshold: 3, kind: "non-text" },
  { name: "focus ring vs paper panel", fg: T.ring, bg: T.paper, threshold: 3, kind: "non-text" },
  { name: "focus ring vs muted surface", fg: T.ring, bg: T.muted, threshold: 3, kind: "non-text" },
  // Chart series vs paper panel (lines/markers on #FFFCF7)
  ...T.series.map((c, i) => ({
    name: `chart series ${i + 1} on paper panel`,
    fg: c,
    bg: T.paper,
    threshold: 3,
    kind: "non-text" as const,
  })),
];

let failures = 0;
const rows: string[] = [];
for (const c of checks) {
  const r = ratio(c.fg, c.bg);
  const pass = r >= c.threshold;
  if (!pass) failures += 1;
  rows.push(
    `[${pass ? "OK " : "FAIL"}] ${c.name} — ${c.fg} on ${c.bg} = ${r.toFixed(2)}:1 (needs ${c.threshold}:1, ${c.kind})`,
  );
}

console.log(rows.join("\n"));
console.log("=".repeat(60));
console.log(`${checks.length} checks, ${failures} failures`);
console.log(
  failures === 0
    ? "WCAG 2.2 AA contrast audit passed."
    : "WCAG 2.2 AA contrast audit FAILED — see FAIL rows above.",
);

// Documented decorative-only pairings (informational, not failures):
// - subtle rule #CFC6B8 on page = decorative separators; interactive
//   components never rely on the rule alone for identification.
// - decorative kuchiba gold #B89A6A appears only in the logo mark (branding).
console.log("informational: border #CFC6B8 vs page = " + ratio(T.border, T.page).toFixed(2) + ":1 (decorative rules only)");
console.log("informational: decorative gold #B89A6A vs page = " + ratio(T.goldDecor, T.page).toFixed(2) + ":1 (logo branding only)");
console.log("informational: strong input rule #A99B87 vs page = " + ratio(T.inputStrong, T.page).toFixed(2) + ":1 (logo frame/callout accent)");

process.exit(failures === 0 ? 0 : 1);
