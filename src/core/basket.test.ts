import { addMany, emptyBasket, removeMany, setNote, toggle } from './basket';

describe('basket', () => {
  it('toggles without mutating the previous basket', () => {
    const a = toggle(emptyBasket, 'V1.1.1');
    expect(a.has('V1.1.1')).toBe(true);
    expect(emptyBasket.size).toBe(0);
    expect(toggle(a, 'V1.1.1').size).toBe(0);
  });

  it('adds many, keeping existing notes', () => {
    const a = setNote(toggle(emptyBasket, 'V1.1.1'), 'V1.1.1', 'keep me');
    const b = addMany(a, ['V1.1.1', 'V1.1.2']);
    expect(b.get('V1.1.1')).toBe('keep me');
    expect(b.get('V1.1.2')).toBe('');
  });

  it('removes many and ignores notes on unselected requirements', () => {
    const a = addMany(emptyBasket, ['V1.1.1', 'V1.1.2']);
    expect(removeMany(a, ['V1.1.1', 'V9.9.9']).size).toBe(1);
    expect(setNote(a, 'V2.2.2', 'x')).toBe(a);
  });
});
