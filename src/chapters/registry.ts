import type { ChapterMeta } from "@/config/chapters";
import { chapters as chapterMetaList } from "@/config/chapters";
import type { ChapterModule } from "@/chapters/types";
import { chapter01 } from "@/chapters/chapter-01";
import { chapter02 } from "@/chapters/chapter-02";
import { chapter03 } from "@/chapters/chapter-03";

/**
 * Chapter registry — maps published chapter modules to their registry
 * entries. Chapters 03–14 have no module yet and render as clearly-labeled
 * placeholders. Adding a chapter = creating its module folder + registering
 * it here; it must then pass `bun run validate:research` before release.
 */

const moduleRegistry: Record<string, ChapterModule> = {
  "population-family": chapter01,
  "economy-industry": chapter02,
  "housing-cost-of-living": chapter03,
};

export interface RegisteredChapter {
  meta: ChapterMeta;
  module: ChapterModule | null;
}

export function getRegisteredChapter(slug: string): RegisteredChapter | undefined {
  const meta = chapterMetaList.find((c) => c.slug === slug);
  if (!meta) return undefined;
  return { meta, module: moduleRegistry[slug] ?? null };
}

export function allRegisteredChapters(): RegisteredChapter[] {
  return chapterMetaList.map((meta) => ({
    meta,
    module: moduleRegistry[meta.slug] ?? null,
  }));
}

export function getChapterModule(slug: string): ChapterModule | null {
  return moduleRegistry[slug] ?? null;
}

/** Aggregate source register across published chapters (for the sources page). */
export function allSources() {
  const out: Array<{ chapter: ChapterMeta; sources: ChapterModule["sources"] }> = [];
  for (const meta of chapterMetaList) {
    const chapterModule = moduleRegistry[meta.slug];
    if (chapterModule && chapterModule.sources.length > 0) {
      out.push({ chapter: meta, sources: chapterModule.sources });
    }
  }
  return out;
}
