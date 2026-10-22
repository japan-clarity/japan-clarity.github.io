import type { ChartSpec, L10n, SourceRecord } from "@/lib/research/types";

/**
 * Chapter module contract — the unit of chapter isolation.
 *
 * Each chapter owns its sections (bilingual content), charts, source
 * register, and metadata. Chapters never import another chapter's private
 * modules; shared UI and chart infrastructure lives in src/components and
 * src/lib. `scripts/validate-research.ts` enforces the contract.
 */

export type CalloutKind =
  | "observation"
  | "comparison"
  | "interpretation"
  | "uncertainty"
  | "action"
  | "note";

export type ContentBlock =
  | { type: "p"; text: L10n }
  | { type: "h3"; id: string; text: L10n }
  | { type: "ul"; items: L10n[] }
  | {
      type: "callout";
      kind: CalloutKind;
      title?: L10n;
      text: L10n;
    }
  | { type: "chart"; chartId: string }
  | {
      type: "stats";
      items: Array<{
        value: L10n;
        label: L10n;
        sourceId: string;
      }>;
    };

export interface ChapterSection {
  /** Stable anchor id used in URLs (#section) and copy-link buttons. */
  id: string;
  heading: L10n;
  blocks: ContentBlock[];
}

export interface ChapterModule {
  /** Chapter slug, matching the registry entry. */
  slug: string;
  /** ISO date of the last content/data update. */
  updatedAt: string;
  sections: ChapterSection[];
  charts: ChartSpec[];
  sources: SourceRecord[];
  /** Chapter-specific limitations rendered in the dedicated section. */
  limitations: L10n[];
}
