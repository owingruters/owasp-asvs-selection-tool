import { profileFileName } from './filename';

describe('profileFileName', () => {
  it('builds a readable slug', () => {
    expect(profileFileName('Acme Payments!', 'v2')).toBe('acme-payments-v2.asvs.json');
  });
  it('never allows path characters or empty names', () => {
    expect(profileFileName('../../etc/passwd', '')).toBe('etc-passwd.asvs.json');
    expect(profileFileName('???', '')).toBe('asvs-selection.asvs.json');
  });
  it('limits length', () => {
    expect(profileFileName('a'.repeat(500), 'v1').length).toBeLessThan(140);
  });
});
