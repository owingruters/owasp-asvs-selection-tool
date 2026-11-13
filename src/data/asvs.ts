import raw from '../../data/asvs/OWASP_Application_Security_Verification_Standard_5.0.0_en.json';

/** ASVS level a requirement first applies at. Higher levels include the lower ones. */
export type Level = 1 | 2 | 3;

export interface Requirement {
  /** Official shortcode, e.g. "V1.2.5". */
  readonly id: string;
  /** Version-qualified citation form, e.g. "v5.0.0-1.2.5". */
  readonly citation: string;
  readonly chapterId: string;
  readonly sectionId: string;
  readonly level: Level;
  readonly description: string;
}

export interface Section {
  readonly id: string;
  readonly name: string;
  readonly chapterId: string;
}

export interface Chapter {
  readonly id: string;
  readonly name: string;
  readonly sections: readonly Section[];
}

export interface AsvsDataset {
  readonly version: string;
  readonly chapters: readonly Chapter[];
  readonly requirements: readonly Requirement[];
}

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Own-property read only, so keys like "__proto__" in untrusted JSON are never followed. */
function get(o: Obj, key: string): unknown {
  return Object.getOwnPropertyDescriptor(o, key)?.value as unknown;
}

function str(o: Obj, key: string, where: string): string {
  const v = get(o, key);
  if (typeof v !== 'string' || v === '')
    throw new Error(`ASVS data: ${where}.${key} must be a non-empty string`);
  return v;
}

function arr(o: Obj, key: string, where: string): unknown[] {
  const v = get(o, key);
  if (!Array.isArray(v)) throw new Error(`ASVS data: ${where}.${key} must be an array`);
  return v as unknown[];
}

function obj(v: unknown, where: string): Obj {
  if (!isObj(v)) throw new Error(`ASVS data: ${where} must be an object`);
  return v;
}

function level(o: Obj, where: string): Level {
  const v = str(o, 'L', where);
  if (v === '1') return 1;
  if (v === '2') return 2;
  if (v === '3') return 3;
  throw new Error(`ASVS data: ${where}.L must be "1", "2" or "3"`);
}

/** Validate untrusted JSON and turn it into a flat, typed dataset. Throws on any deviation. */
export function parseAsvs(input: unknown): AsvsDataset {
  const root = obj(input, 'root');
  const version = str(root, 'Version', 'root');
  const chapters: Chapter[] = [];
  const requirements: Requirement[] = [];
  const seen = new Set<string>();

  for (const c of arr(root, 'Requirements', 'root')) {
    const chapter = obj(c, 'chapter');
    const chapterId = str(chapter, 'Shortcode', 'chapter');
    const sections: Section[] = [];

    for (const s of arr(chapter, 'Items', chapterId)) {
      const section = obj(s, 'section');
      const sectionId = str(section, 'Shortcode', 'section');
      sections.push({ id: sectionId, name: str(section, 'Name', sectionId), chapterId });

      for (const r of arr(section, 'Items', sectionId)) {
        const req = obj(r, 'requirement');
        const id = str(req, 'Shortcode', 'requirement');
        if (seen.has(id)) throw new Error(`ASVS data: duplicate requirement ${id}`);
        seen.add(id);
        requirements.push({
          id,
          citation: `v${version}-${id.replace(/^V/, '')}`,
          chapterId,
          sectionId,
          level: level(req, id),
          description: str(req, 'Description', id),
        });
      }
    }
    chapters.push({ id: chapterId, name: str(chapter, 'Name', chapterId), sections });
  }

  return { version, chapters, requirements };
}

/** The bundled, official ASVS 5.0.0 dataset (validated at load time). */
export const asvs: AsvsDataset = parseAsvs(raw);
