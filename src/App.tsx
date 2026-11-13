import { useMemo, useState } from 'react';
import { addMany, emptyBasket, removeMany, setNote, toggle, type Basket } from './core/basket';
import { filterRequirements } from './core/filter';
import { profileFileName } from './core/filename';
import { createProfile, profileToBasket, serializeProfile, type Profile } from './core/profile';
import { asvs } from './data/asvs';
import { BasketPanel, type Meta } from './ui/BasketPanel';
import { Filters, noFilters, type FilterState } from './ui/Filters';
import { RequirementList } from './ui/RequirementList';
import './styles.css';

export function App() {
  const [filters, setFilters] = useState<FilterState>(noFilters);
  const [basket, setBasket] = useState<Basket>(emptyBasket);
  const [meta, setMeta] = useState<Meta>({ name: '', description: '', profileVersion: 'v1' });

  const shown = useMemo(() => filterRequirements(asvs, filters), [filters]);
  const shownIds = useMemo(() => shown.map((r) => r.id), [shown]);

  const onSave = (): string | null => {
    if (meta.name.trim() === '' || meta.profileVersion.trim() === '') return null;
    const profile = createProfile(asvs, { ...meta, updatedAt: new Date().toISOString() }, basket);
    return serializeProfile(profile);
  };

  const onOpen = (profile: Profile) => {
    setBasket(profileToBasket(profile));
    setMeta({
      name: profile.name,
      description: profile.description,
      profileVersion: profile.profileVersion,
    });
  };

  return (
    <>
      <header className="site-header">
        <h1>ASVS Selection Tool</h1>
        <p>
          Build your own version of OWASP ASVS {asvs.version}: filter, select, save.{' '}
          <strong>Unofficial tool, not affiliated with or endorsed by OWASP.</strong>
        </p>
      </header>
      <main className="layout">
        <Filters data={asvs} value={filters} onChange={setFilters} />
        <section aria-labelledby="reqs-h">
          <h2 id="reqs-h">
            Requirements <span className="muted">({shown.length} shown)</span>
          </h2>
          <RequirementList
            requirements={shown}
            basket={basket}
            onToggle={(id) => {
              setBasket((b) => toggle(b, id));
            }}
            onNote={(id, note) => {
              setBasket((b) => setNote(b, id, note));
            }}
          />
        </section>
        <BasketPanel
          data={asvs}
          basket={basket}
          shownCount={shown.length}
          meta={meta}
          onMeta={setMeta}
          onSelectShown={() => {
            setBasket((b) => addMany(b, shownIds));
          }}
          onClearShown={() => {
            setBasket((b) => removeMany(b, shownIds));
          }}
          onClearAll={() => {
            setBasket(emptyBasket);
          }}
          onSave={onSave}
          onOpen={onOpen}
          saveFileName={profileFileName(meta.name, meta.profileVersion)}
        />
      </main>
      <footer className="site-footer">
        <p>
          ASVS content © OWASP Foundation, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noreferrer noopener">
            CC BY-SA 4.0
          </a>
          . Source:{' '}
          <a href="https://github.com/OWASP/ASVS" rel="noreferrer noopener">
            github.com/OWASP/ASVS
          </a>
          . This tool&apos;s code is MIT licensed.
        </p>
      </footer>
    </>
  );
}
