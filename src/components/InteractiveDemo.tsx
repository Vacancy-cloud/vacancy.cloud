import { useRef, useState } from 'react';
import MapboxMap from './MapboxMap';
import BuildingCard from './BuildingCard';
import { buildings } from '../data/buildings';
import { Building } from '../types';

type EntryMode = 'find' | 'upload';

const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
const BUILDING_TYPES = ['Office', 'Industrial', 'Warehouse', 'Public', 'Mixed-use'] as const;
const CONSTRUCTION_PERIODS = [
  'Before 1960',
  '1960–1979',
  '1980–1999',
  '2000–2019',
  '2020+',
] as const;
const MAIN_MATERIALS = ['Brick', 'Concrete', 'Steel', 'Timber', 'Unknown'] as const;

type DemoFilters = {
  floorAreaMin: string;
  floorAreaMax: string;
  energyClasses: string[];
  buildingTypes: string[];
  constructionPeriod: string;
  mainMaterial: string;
};

const initialFilters: DemoFilters = {
  floorAreaMin: '',
  floorAreaMax: '',
  energyClasses: [],
  buildingTypes: [],
  constructionPeriod: '',
  mainMaterial: '',
};

const IconSearch = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
  </svg>
);

const IconUpload = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
  </svg>
);

const IconFilters = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

const InteractiveDemo = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [entryMode, setEntryMode] = useState<EntryMode>('find');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [filters, setFilters] = useState<DemoFilters>(initialFilters);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleEnergyClass = (cls: string) => {
    setFilters((prev) => ({
      ...prev,
      energyClasses: prev.energyClasses.includes(cls)
        ? prev.energyClasses.filter((c) => c !== cls)
        : [...prev.energyClasses, cls],
    }));
  };

  const toggleBuildingType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      buildingTypes: prev.buildingTypes.includes(type)
        ? prev.buildingTypes.filter((t) => t !== type)
        : [...prev.buildingTypes, type],
    }));
  };

  const modeButtonClass = (active: boolean) =>
    `flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
      active
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-text-dark hover:bg-gray-50 font-medium'
    }`;

  return (
    <section id="demo" className="bg-background py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1680px] px-3 sm:px-5 lg:px-6 xl:px-8">
        <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
          Early-stage building screening
        </p>
        <h2 className="mb-2 text-left text-2xl font-bold text-text-dark sm:text-3xl md:text-4xl">
          Start with a building or a portfolio.
        </h2>
        <p className="mb-5 max-w-3xl text-left text-sm text-text-muted sm:mb-6 sm:text-base">
          Search one asset, upload a portfolio, and narrow the view using building filters.
        </p>

        {/* Full-width product workspace */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(168px,15%)_minmax(0,55%)_minmax(280px,30%)] lg:items-stretch">
            {/* LEFT SIDEBAR */}
            <aside className="flex flex-col border-b border-gray-200 bg-white lg:border-b-0 lg:border-r">
              <nav className="flex flex-row gap-1 border-b border-gray-100 p-2 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:p-3">
                <button
                  type="button"
                  onClick={() => setEntryMode('find')}
                  className={modeButtonClass(entryMode === 'find')}
                >
                  <IconSearch />
                  <span className="truncate">Find Building</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('upload')}
                  className={modeButtonClass(entryMode === 'upload')}
                >
                  <IconUpload />
                  <span className="truncate">Upload Portfolio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className={modeButtonClass(filtersOpen)}
                  aria-expanded={filtersOpen}
                >
                  <IconFilters />
                  <span className="truncate">Filters</span>
                </button>
              </nav>

              <div className="flex flex-1 flex-col gap-4 p-3 pt-2">
                {/* Mode input */}
                {entryMode === 'find' ? (
                  <div>
                    <label
                      htmlFor="demo-address"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted"
                    >
                      Address
                    </label>
                    <input
                      id="demo-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter building address"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-text-dark placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Upload CSV or Excel
                    </p>
                    <p className="mb-2.5 text-xs text-text-muted">One building per row</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={() => {
                        /* Demo UI only — no upload processing */
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-dark transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      Choose file
                    </button>
                  </div>
                )}

                {/* Filters — available in both modes */}
                {filtersOpen && (
                  <div className="space-y-4 border-t border-gray-100 pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Filters
                    </p>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-text-dark">Floor area</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="Min m²"
                          value={filters.floorAreaMin}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, floorAreaMin: e.target.value }))
                          }
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="Max m²"
                          value={filters.floorAreaMax}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, floorAreaMax: e.target.value }))
                          }
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-text-dark">Energy class</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ENERGY_CLASSES.map((cls) => {
                          const active = filters.energyClasses.includes(cls);
                          return (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => toggleEnergyClass(cls)}
                              className={`h-7 min-w-[1.75rem] rounded-md border px-1.5 text-xs font-semibold transition-colors ${
                                active
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-200 text-text-muted hover:border-primary/40'
                              }`}
                            >
                              {cls}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium text-text-dark">Building type</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BUILDING_TYPES.map((type) => {
                          const active = filters.buildingTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => toggleBuildingType(type)}
                              className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                                active
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-200 text-text-muted hover:border-primary/40'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="demo-period"
                        className="mb-1.5 block text-xs font-medium text-text-dark"
                      >
                        Construction period
                      </label>
                      <select
                        id="demo-period"
                        value={filters.constructionPeriod}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            constructionPeriod: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Any period</option>
                        {CONSTRUCTION_PERIODS.map((period) => (
                          <option key={period} value={period}>
                            {period}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="demo-material"
                        className="mb-1.5 block text-xs font-medium text-text-dark"
                      >
                        Main material
                      </label>
                      <select
                        id="demo-material"
                        value={filters.mainMaterial}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, mainMaterial: e.target.value }))
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Any material</option>
                        {MAIN_MATERIALS.map((material) => (
                          <option key={material} value={material}>
                            {material}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* CENTER MAP */}
            <div className="relative h-[420px] min-h-0 border-b border-gray-200 sm:h-[520px] lg:h-[680px] lg:border-b-0 lg:border-r">
              <MapboxMap
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onBuildingSelect={setSelectedBuilding}
              />
            </div>

            {/* RIGHT ASSESSMENT PANEL */}
            <div className="h-[420px] min-h-0 sm:h-[520px] lg:h-[680px]">
              <BuildingCard building={selectedBuilding} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
