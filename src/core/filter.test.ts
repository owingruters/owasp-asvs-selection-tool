import { asvs } from '../data/asvs';
import { filterRequirements } from './filter';

describe('filterRequirements', () => {
  it('returns everything without filters', () => {
    expect(filterRequirements(asvs, {})).toHaveLength(345);
    expect(filterRequirements(asvs, { chapterIds: new Set(), text: '  ' })).toHaveLength(345);
  });

  it('filters by chapter and section', () => {
    const ch = filterRequirements(asvs, { chapterIds: new Set(['V1']) });
    expect(ch.length).toBeGreaterThan(0);
    expect(ch.every((r) => r.chapterId === 'V1')).toBe(true);
    const sec = filterRequirements(asvs, { sectionIds: new Set(['V1.2']) });
    expect(sec.every((r) => r.sectionId === 'V1.2')).toBe(true);
  });

  it('filters by exact level', () => {
    expect(filterRequirements(asvs, { levels: new Set([1]) })).toHaveLength(70);
    expect(filterRequirements(asvs, { levels: new Set([1, 3]) })).toHaveLength(162);
  });

  it('requires every word in text search, case-insensitively, also matching ids', () => {
    const hits = filterRequirements(asvs, { text: 'INPUT canonical' });
    expect(hits.length).toBeGreaterThan(0);
    expect(
      hits.every((r) => /input/i.test(r.description) && /canonical/i.test(r.description)),
    ).toBe(true);
    expect(filterRequirements(asvs, { text: 'v1.1.1' }).map((r) => r.id)).toContain('V1.1.1');
    expect(filterRequirements(asvs, { text: 'zzzz-no-such-word' })).toHaveLength(0);
  });

  it('combines filters with AND', () => {
    const r = filterRequirements(asvs, { chapterIds: new Set(['V6']), levels: new Set([1]) });
    expect(r.every((x) => x.chapterId === 'V6' && x.level === 1)).toBe(true);
  });
});
