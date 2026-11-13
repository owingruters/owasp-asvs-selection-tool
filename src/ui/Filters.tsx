import type { AsvsDataset, Level } from '../data/asvs';

export interface FilterState {
  readonly chapterIds: ReadonlySet<string>;
  readonly levels: ReadonlySet<Level>;
  readonly text: string;
}

export const noFilters: FilterState = { chapterIds: new Set(), levels: new Set(), text: '' };

function flip<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set);
  if (!next.delete(value)) next.add(value);
  return next;
}

interface Props {
  readonly data: AsvsDataset;
  readonly value: FilterState;
  readonly onChange: (next: FilterState) => void;
}

export function Filters({ data, value, onChange }: Props) {
  return (
    <section aria-labelledby="filters-h" className="panel">
      <h2 id="filters-h">Filters</h2>

      <label className="field">
        <span>Search</span>
        <input
          type="search"
          value={value.text}
          onChange={(e) => {
            onChange({ ...value, text: e.target.value });
          }}
          placeholder="e.g. session token"
        />
      </label>

      <fieldset>
        <legend>Level (exact)</legend>
        {([1, 2, 3] as const).map((l) => (
          <label key={l} className="check">
            <input
              type="checkbox"
              checked={value.levels.has(l)}
              onChange={() => {
                onChange({ ...value, levels: flip(value.levels, l) });
              }}
            />
            Level {l}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Chapter</legend>
        {data.chapters.map((c) => (
          <label key={c.id} className="check">
            <input
              type="checkbox"
              checked={value.chapterIds.has(c.id)}
              onChange={() => {
                onChange({ ...value, chapterIds: flip(value.chapterIds, c.id) });
              }}
            />
            {c.id.replace(/^V/, '')}. {c.name}
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        onClick={() => {
          onChange(noFilters);
        }}
      >
        Reset filters
      </button>
    </section>
  );
}
