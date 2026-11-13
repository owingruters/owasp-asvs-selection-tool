import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { asvs } from '../data/asvs';
import { emptyBasket, addMany } from './basket';
import { LIMITS, createProfile } from './profile';

const schema = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../docs/schema/profile.schema.json'), 'utf8'),
) as { required: string[]; properties: Record<string, { maxLength?: number }> };

describe('published JSON Schema stays in sync with the code', () => {
  const profile = createProfile(
    asvs,
    { name: 'n', description: 'd', profileVersion: 'v1', updatedAt: '2026-01-31T12:00:00.000Z' },
    addMany(emptyBasket, ['V1.1.1']),
  );

  it('lists exactly the keys the app writes', () => {
    expect(Object.keys(schema.properties).sort()).toEqual(Object.keys(profile).sort());
    expect(schema.required.every((k) => k in profile)).toBe(true);
  });

  it('uses the same limits as the validator', () => {
    expect(schema.properties.name?.maxLength).toBe(LIMITS.name);
    expect(schema.properties.description?.maxLength).toBe(LIMITS.description);
    expect(schema.properties.profileVersion?.maxLength).toBe(LIMITS.profileVersion);
  });
});
