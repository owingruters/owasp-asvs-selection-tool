/** Small validation helpers for untrusted JSON. Own-property reads only. */
export type Obj = Record<string, unknown>;

export function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Own-property read, so keys like "__proto__" in untrusted JSON are never followed. */
export function get(o: Obj, key: string): unknown {
  return Object.getOwnPropertyDescriptor(o, key)?.value as unknown;
}
