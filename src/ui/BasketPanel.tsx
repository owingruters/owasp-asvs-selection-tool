import { useRef, useState } from 'react';
import type { Basket } from '../core/basket';
import { LIMITS, ProfileError, parseProfile, type Profile } from '../core/profile';
import type { AsvsDataset } from '../data/asvs';

export interface Meta {
  readonly name: string;
  readonly description: string;
  readonly profileVersion: string;
}

interface Props {
  readonly data: AsvsDataset;
  readonly basket: Basket;
  readonly shownCount: number;
  readonly meta: Meta;
  readonly onMeta: (meta: Meta) => void;
  readonly onSelectShown: () => void;
  readonly onClearShown: () => void;
  readonly onClearAll: () => void;
  readonly onSave: () => string | null;
  readonly onOpen: (profile: Profile) => void;
  readonly saveFileName: string;
}

function download(text: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BasketPanel(props: Props) {
  const { data, basket, shownCount, meta, onMeta } = props;
  const [message, setMessage] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const open = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > LIMITS.fileChars) throw new ProfileError('File is too large');
      const profile = parseProfile(await file.text(), data);
      props.onOpen(profile);
      setMessage({
        kind: 'ok',
        text: `Opened "${profile.name}" (${String(profile.requirements.length)} requirements).`,
      });
    } catch (e) {
      setMessage({
        kind: 'error',
        text: e instanceof ProfileError ? e.message : 'The file could not be read',
      });
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const save = () => {
    const text = props.onSave();
    if (text === null) {
      setMessage({ kind: 'error', text: 'Give the selection a name and a version before saving.' });
      return;
    }
    download(text, props.saveFileName);
    setMessage({ kind: 'ok', text: `Saved as ${props.saveFileName}` });
  };

  return (
    <section aria-labelledby="basket-h" className="panel">
      <h2 id="basket-h">Your selection</h2>
      <p>
        <strong>{basket.size}</strong> of {data.requirements.length} requirements selected
      </p>

      <div className="row">
        <button type="button" onClick={props.onSelectShown} disabled={shownCount === 0}>
          Select all shown ({shownCount})
        </button>
        <button type="button" onClick={props.onClearShown} disabled={shownCount === 0}>
          Deselect shown
        </button>
        <button type="button" onClick={props.onClearAll} disabled={basket.size === 0}>
          Clear all
        </button>
      </div>

      <label className="field">
        <span>Name (company, team or project)</span>
        <input
          value={meta.name}
          maxLength={LIMITS.name}
          onChange={(e) => {
            onMeta({ ...meta, name: e.target.value });
          }}
        />
      </label>
      <label className="field">
        <span>Version of this selection</span>
        <input
          value={meta.profileVersion}
          maxLength={LIMITS.profileVersion}
          onChange={(e) => {
            onMeta({ ...meta, profileVersion: e.target.value });
          }}
        />
      </label>
      <label className="field">
        <span>Description (optional)</span>
        <textarea
          rows={2}
          value={meta.description}
          maxLength={LIMITS.description}
          onChange={(e) => {
            onMeta({ ...meta, description: e.target.value });
          }}
        />
      </label>

      <div className="row">
        <button type="button" onClick={save}>
          Save to file
        </button>
        <label className="button">
          Open file
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="visually-hidden"
            onChange={(e) => {
              void open(e.target.files?.[0]);
            }}
          />
        </label>
      </div>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={message.kind}>
          {message.text}
        </p>
      )}
    </section>
  );
}
