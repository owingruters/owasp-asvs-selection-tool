import { asvs } from '../data/asvs';
import { addMany, emptyBasket, setNote } from './basket';
import {
  LIMITS,
  ProfileError,
  createProfile,
  parseProfile,
  profileToBasket,
  serializeProfile,
} from './profile';

const meta = {
  name: 'Acme Payments Team',
  description: 'Selection for the payments service',
  profileVersion: 'v1',
  updatedAt: '2026-01-31T12:00:00.000Z',
};

function valid(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    schemaVersion: 1,
    ...meta,
    asvsVersion: '5.0.0',
    requirements: [{ id: 'V1.1.1', note: 'n' }],
    ...overrides,
  });
}

describe('profile round trip', () => {
  it('saves and re-opens exactly the same selection, in ASVS order', () => {
    const basket = setNote(addMany(emptyBasket, ['V2.1.1', 'V1.1.1']), 'V2.1.1', 'not applicable');
    const profile = createProfile(asvs, meta, basket);
    expect(profile.requirements.map((r) => r.id)).toEqual(['V1.1.1', 'V2.1.1']);

    const reopened = parseProfile(serializeProfile(profile), asvs);
    expect(reopened).toEqual(profile);
    expect(profileToBasket(reopened).get('V2.1.1')).toBe('not applicable');
  });

  it('contains only ids and notes, never ASVS requirement text', () => {
    const file = serializeProfile(createProfile(asvs, meta, addMany(emptyBasket, ['V1.1.1'])));
    expect(file).not.toContain('canonical form');
  });
});

describe('parseProfile rejects bad files', () => {
  it.each([
    ['not json', '{nope', /not valid JSON/],
    ['an array', '[]', /JSON object/],
    ['a wrong schemaVersion', valid({ schemaVersion: 2 }), /schemaVersion/],
    ['another ASVS version', valid({ asvsVersion: '4.0.3' }), /only 5.0.0/],
    ['an empty name', valid({ name: '  ' }), /"name" must not be empty/],
    ['a non-string name', valid({ name: 5 }), /"name" must be a string/],
    ['a bad timestamp', valid({ updatedAt: 'yesterday' }), /UTC timestamp/],
    ['an impossible date', valid({ updatedAt: '2026-13-45T00:00:00.000Z' }), /UTC timestamp/],
    ['requirements not an array', valid({ requirements: {} }), /must be an array/],
    ['an entry that is not an object', valid({ requirements: ['V1.1.1'] }), /must be an object/],
    ['an unknown id', valid({ requirements: [{ id: 'V99.9.9' }] }), /Unknown requirement/],
    [
      'a duplicate id',
      valid({ requirements: [{ id: 'V1.1.1' }, { id: 'V1.1.1' }] }),
      /Duplicate requirement/,
    ],
    [
      'an oversize note',
      valid({ requirements: [{ id: 'V1.1.1', note: 'x'.repeat(LIMITS.note + 1) }] }),
      /longer than/,
    ],
    ['an oversize file', ' '.repeat(LIMITS.fileChars + 1), /too large/],
  ])('rejects %s', (_label, input, message) => {
    expect(() => parseProfile(input, asvs)).toThrow(ProfileError);
    expect(() => parseProfile(input, asvs)).toThrow(message);
  });

  it('treats missing optional fields as empty and ignores unknown extra fields', () => {
    const p = parseProfile(
      valid({ description: undefined, requirements: [{ id: 'V1.1.1' }], extra: '<script>' }),
      asvs,
    );
    expect(p.description).toBe('');
    expect(p.requirements[0]?.note).toBe('');
    expect(JSON.stringify(p)).not.toContain('<script>');
  });

  it('is not affected by prototype-pollution keys', () => {
    const polluted = '{"__proto__":{"polluted":true},' + valid().slice(1);
    parseProfile(polluted, asvs);
    expect(Reflect.get({}, 'polluted')).toBeUndefined();
  });

  it('never echoes hostile input back in error messages', () => {
    const hostile = '<img src=x onerror=alert(1)>';
    for (const id of [hostile, hostile.repeat(5)]) {
      try {
        parseProfile(valid({ requirements: [{ id }] }), asvs);
        expect.unreachable();
      } catch (e) {
        expect((e as Error).message.length).toBeLessThan(80);
      }
    }
  });
});
