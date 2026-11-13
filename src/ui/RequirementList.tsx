import type { Basket } from '../core/basket';
import type { Requirement } from '../data/asvs';

interface Props {
  readonly requirements: readonly Requirement[];
  readonly basket: Basket;
  readonly onToggle: (id: string) => void;
  readonly onNote: (id: string, note: string) => void;
}

export function RequirementList({ requirements, basket, onToggle, onNote }: Props) {
  if (requirements.length === 0) {
    return <p role="status">No requirements match these filters.</p>;
  }
  return (
    <ul className="reqs">
      {requirements.map((r) => {
        const selected = basket.has(r.id);
        return (
          <li key={r.id} className={selected ? 'req selected' : 'req'}>
            <label className="req-main">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => {
                  onToggle(r.id);
                }}
                aria-label={`Select ${r.id.replace(/^V/, '')}`}
              />
              <span className="req-id">{r.id.replace(/^V/, '')}</span>
              <span className="req-level">L{r.level}</span>
              <span className="req-text">{r.description}</span>
            </label>
            {selected && (
              <label className="field note">
                <span>Note for {r.id.replace(/^V/, '')}</span>
                <textarea
                  rows={2}
                  maxLength={2000}
                  value={basket.get(r.id) ?? ''}
                  onChange={(e) => {
                    onNote(r.id, e.target.value);
                  }}
                />
              </label>
            )}
          </li>
        );
      })}
    </ul>
  );
}
