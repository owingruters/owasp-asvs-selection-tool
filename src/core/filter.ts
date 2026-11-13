import type { AsvsDataset, Level, Requirement } from '../data/asvs';

export interface Filters {
  /** Empty set = no restriction. */
  readonly chapterIds?: ReadonlySet<string>;
  readonly sectionIds?: ReadonlySet<string>;
  /** Exact levels to include. An L2 requirement is only matched if 2 is in this set. */
  readonly levels?: ReadonlySet<Level>;
  /** Case-insensitive; every whitespace-separated word must appear in the id or description. */
  readonly text?: string;
}

function allows<T>(set: ReadonlySet<T> | undefined, value: T): boolean {
  return set === undefined || set.size === 0 || set.has(value);
}

export function filterRequirements(data: AsvsDataset, filters: Filters): Requirement[] {
  const words = (filters.text ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  return data.requirements.filter((r) => {
    if (!allows(filters.chapterIds, r.chapterId)) return false;
    if (!allows(filters.sectionIds, r.sectionId)) return false;
    if (!allows(filters.levels, r.level)) return false;
    if (words.length === 0) return true;
    const haystack = `${r.id} ${r.description}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}
