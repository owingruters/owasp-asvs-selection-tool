/** Selected requirements: id -> note ("" when there is no note). Never mutated in place. */
export type Basket = ReadonlyMap<string, string>;

export const emptyBasket: Basket = new Map();

export function toggle(basket: Basket, id: string): Basket {
  const next = new Map(basket);
  if (!next.delete(id)) next.set(id, '');
  return next;
}

/** Adds ids that are not yet selected; existing notes are kept. */
export function addMany(basket: Basket, ids: readonly string[]): Basket {
  const next = new Map(basket);
  for (const id of ids) if (!next.has(id)) next.set(id, '');
  return next;
}

export function removeMany(basket: Basket, ids: readonly string[]): Basket {
  const next = new Map(basket);
  for (const id of ids) next.delete(id);
  return next;
}

/** Sets a note on a selected requirement. Ignored if the requirement is not selected. */
export function setNote(basket: Basket, id: string, note: string): Basket {
  if (!basket.has(id)) return basket;
  return new Map(basket).set(id, note);
}
