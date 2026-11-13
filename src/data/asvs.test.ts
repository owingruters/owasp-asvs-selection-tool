import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { asvs, parseAsvs } from './asvs';

const dir = resolve(import.meta.dirname, '../../data/asvs');
const file = 'OWASP_Application_Security_Verification_Standard_5.0.0_en.json';

describe('bundled ASVS data', () => {
  it('matches the pinned checksum (data is unmodified)', () => {
    const sums = readFileSync(resolve(dir, 'SHA256SUMS'), 'utf8');
    const actual = createHash('sha256')
      .update(readFileSync(resolve(dir, file)))
      .digest('hex');
    expect(sums).toContain(`${actual}  ${file}`);
  });

  it('has the official counts for 5.0.0', () => {
    expect(asvs.version).toBe('5.0.0');
    expect(asvs.chapters).toHaveLength(17);
    expect(asvs.chapters.flatMap((c) => c.sections)).toHaveLength(80);
    expect(asvs.requirements).toHaveLength(345);
    const perLevel = (l: number) => asvs.requirements.filter((r) => r.level === l).length;
    expect([perLevel(1), perLevel(2), perLevel(3)]).toEqual([70, 183, 92]);
  });

  it('builds version-qualified citations', () => {
    const first = asvs.requirements[0];
    expect(first?.id).toBe('V1.1.1');
    expect(first?.citation).toBe('v5.0.0-1.1.1');
  });

  it('has unique ids that belong to a known section and chapter', () => {
    const ids = new Set(asvs.requirements.map((r) => r.id));
    expect(ids.size).toBe(asvs.requirements.length);
    const sections = new Set(asvs.chapters.flatMap((c) => c.sections.map((s) => s.id)));
    expect(asvs.requirements.every((r) => sections.has(r.sectionId))).toBe(true);
  });
});

describe('parseAsvs rejects malformed input', () => {
  const ok = {
    Version: '5.0.0',
    Requirements: [
      {
        Shortcode: 'V1',
        Name: 'C',
        Items: [
          {
            Shortcode: 'V1.1',
            Name: 'S',
            Items: [{ Shortcode: 'V1.1.1', L: '1', Description: 'd' }],
          },
        ],
      },
    ],
  };

  it('accepts a minimal valid document', () => {
    expect(parseAsvs(ok).requirements).toHaveLength(1);
  });

  it.each([null, 'text', [], {}, { Version: '5.0.0' }, { Version: '5.0.0', Requirements: {} }])(
    'throws on %j',
    (bad) => {
      expect(() => parseAsvs(bad)).toThrow(/ASVS data/);
    },
  );

  it('throws on an invalid level', () => {
    const bad = structuredClone(ok);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bad.Requirements[0]!.Items[0]!.Items[0]!.L = '4';
    expect(() => parseAsvs(bad)).toThrow(/\.L must be/);
  });

  it('throws on duplicate requirement ids', () => {
    const bad = structuredClone(ok);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bad.Requirements[0]!.Items[0]!.Items.push({ Shortcode: 'V1.1.1', L: '1', Description: 'd' });
    expect(() => parseAsvs(bad)).toThrow(/duplicate/);
  });
});
