import type { AsvsDataset } from '../data/asvs';
import type { Basket } from './basket';
import { get, isObj, type Obj } from './guards';

/**
 * The "Save" file: a customised ASVS selection (company/team/project version).
 * It holds only ids and the user's own notes, never ASVS text.
 */
export interface Profile {
  readonly schemaVersion: 1;
  readonly name: string;
  readonly description: string;
  /** The user's own version label for this selection, e.g. "v2". */
  readonly profileVersion: string;
  /** ASVS version the ids refer to, e.g. "5.0.0". */
  readonly asvsVersion: string;
  /** ISO 8601 UTC timestamp. */
  readonly updatedAt: string;
  readonly requirements: readonly { readonly id: string; readonly note: string }[];
}

export const LIMITS = {
  fileChars: 1_000_000,
  name: 200,
  description: 2_000,
  profileVersion: 50,
  note: 2_000,
} as const;

export class ProfileError extends Error {
  override name = 'ProfileError';
}

export interface ProfileMeta {
  readonly name: string;
  readonly description: string;
  readonly profileVersion: string;
  readonly updatedAt: string;
}

/** Build a profile from the basket. Requirements follow ASVS order so saved files diff cleanly. */
export function createProfile(data: AsvsDataset, meta: ProfileMeta, basket: Basket): Profile {
  const requirements = data.requirements
    .filter((r) => basket.has(r.id))
    .map((r) => ({ id: r.id, note: basket.get(r.id) ?? '' }));
  return { schemaVersion: 1, ...meta, asvsVersion: data.version, requirements };
}

export function serializeProfile(profile: Profile): string {
  return `${JSON.stringify(profile, null, 2)}\n`;
}

export function profileToBasket(profile: Profile): Basket {
  return new Map(profile.requirements.map((r) => [r.id, r.note]));
}

function text(o: Obj, key: string, max: number, required: boolean): string {
  const v = get(o, key);
  if (v === undefined && !required) return '';
  if (typeof v !== 'string') throw new ProfileError(`"${key}" must be a string`);
  if (required && v.trim() === '') throw new ProfileError(`"${key}" must not be empty`);
  if (v.length > max) throw new ProfileError(`"${key}" is longer than ${String(max)} characters`);
  return v;
}

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** Parse and validate an opened file. Throws ProfileError with a user-readable message. */
export function parseProfile(source: string, data: AsvsDataset): Profile {
  if (source.length > LIMITS.fileChars) throw new ProfileError('File is too large');

  let json: unknown;
  try {
    json = JSON.parse(source);
  } catch {
    throw new ProfileError('File is not valid JSON');
  }
  if (!isObj(json)) throw new ProfileError('File must contain a JSON object');

  if (get(json, 'schemaVersion') !== 1) {
    throw new ProfileError('Unsupported schemaVersion (expected 1)');
  }
  const asvsVersion = text(json, 'asvsVersion', 20, true);
  if (asvsVersion !== data.version) {
    throw new ProfileError(
      `This file is for ASVS ${asvsVersion}, but only ${data.version} is supported`,
    );
  }
  const updatedAt = text(json, 'updatedAt', 30, true);
  if (!ISO_UTC.test(updatedAt) || Number.isNaN(Date.parse(updatedAt))) {
    throw new ProfileError('"updatedAt" must be a UTC timestamp like 2026-01-31T12:00:00.000Z');
  }

  const list = get(json, 'requirements');
  if (!Array.isArray(list)) throw new ProfileError('"requirements" must be an array');
  const known = new Set(data.requirements.map((r) => r.id));
  const notes = new Map<string, string>();
  for (const entry of list as unknown[]) {
    if (!isObj(entry)) throw new ProfileError('Each requirement entry must be an object');
    const id = text(entry, 'id', 30, true);
    if (!known.has(id)) throw new ProfileError(`Unknown requirement id: ${id.slice(0, 30)}`);
    if (notes.has(id)) throw new ProfileError(`Duplicate requirement id: ${id}`);
    notes.set(id, text(entry, 'note', LIMITS.note, false));
  }

  const requirements = data.requirements
    .filter((r) => notes.has(r.id))
    .map((r) => ({ id: r.id, note: notes.get(r.id) ?? '' }));

  return {
    schemaVersion: 1,
    name: text(json, 'name', LIMITS.name, true),
    description: text(json, 'description', LIMITS.description, false),
    profileVersion: text(json, 'profileVersion', LIMITS.profileVersion, true),
    asvsVersion,
    updatedAt,
    requirements,
  };
}
