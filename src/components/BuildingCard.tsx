import { useNavigate } from 'react-router-dom';
import { Building } from '../types';

interface BuildingCardProps {
  building: Building | null;
}

const MATERIAL_LABELS: Record<string, string> = {
  brick: 'Masonry',
  concrete: 'Concrete',
  wood: 'Wood',
  other: 'Other',
};

const BuildingCard = ({ building }: BuildingCardProps) => {
  const navigate = useNavigate();

  if (!building) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-white rounded-card shadow-md border border-gray-100">
        <div className="text-center max-w-xs">
          <svg
            className="w-14 h-14 mx-auto text-text-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-text-dark font-semibold text-lg">Select a building</p>
          <p className="text-text-muted text-sm mt-2">
            Click a map marker to open an Upgrade &amp; Reuse Assessment
          </p>
        </div>
      </div>
    );
  }

  const esg = building.esgData;
  const currentClass = esg?.energyClass ?? null;
  const targetClass = esg?.renovationToEnergyClassB ? 'B' : null;
  const breakdown = esg?.materialBreakdown;

  const retainInSitu: string[] = [];
  const reuseExSitu: string[] = [];

  if (breakdown) {
    (Object.entries(breakdown) as [string, string][]).forEach(([key, value]) => {
      const label = MATERIAL_LABELS[key] ?? key;
      const lower = value.toLowerCase();
      // High in-place reuse / masonry typically retained; recyclable/removed materials → ex-situ
      if (key === 'brick' || lower.includes('high reuse') || lower.includes('høj genbrug')) {
        retainInSitu.push(`${label} — ${value}`);
      } else if (key !== 'other') {
        reuseExSitu.push(`${label} — ${value}`);
      }
    });
  }

  const structureCategories = breakdown
    ? (Object.keys(breakdown) as string[])
        .filter((key) => key !== 'other' && breakdown[key as keyof typeof breakdown])
        .map((key) => MATERIAL_LABELS[key] ?? key)
    : [];

  return (
    <div className="h-full flex flex-col bg-white rounded-card shadow-md overflow-hidden border border-gray-100">
      {/* Building identity */}
      <div className="shrink-0 p-4 border-b border-gray-200 bg-background/80">
        <div className="flex gap-3 items-start">
          {building.image && (
            <img
              src={building.image}
              alt=""
              className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-0.5">
              Upgrade &amp; Reuse Assessment
            </p>
            <h2 className="text-base font-bold text-text-dark truncate">{building.name}</h2>
            <p className="text-xs text-text-muted truncate">{building.address}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. ENERGY PATHWAY — most prominent */}
        <section className="rounded-card border border-primary/20 bg-primary/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
            Energy pathway
          </p>
          {currentClass && targetClass ? (
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 bg-white text-2xl font-bold text-text-muted">
                {currentClass}
              </span>
              <span className="text-primary text-xl font-bold" aria-hidden="true">
                →
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-2xl font-bold text-text-dark">
                {targetClass}
              </span>
            </div>
          ) : (
            <p className="text-sm text-text-muted mb-3 text-center">Available after assessment</p>
          )}
          <p className="text-sm font-semibold text-text-dark text-center mb-1">Upgrade potential</p>
          <p className="text-xs text-text-muted text-center leading-relaxed">
            Indicative pathway based on building characteristics, energy data and upgrade scenarios.
          </p>
        </section>

        {/* 2. STRUCTURE TO RETAIN */}
        <section className="rounded-card border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
            Structure to retain
          </p>
          <p className="text-3xl font-bold text-text-dark mb-1">
            Available after assessment
          </p>
          <p className="text-sm font-medium text-text-dark mb-3">
            Existing structure potentially retained
          </p>
          {structureCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {structureCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex rounded-full border border-gray-200 bg-background px-2.5 py-1 text-xs font-medium text-text-dark"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">Retention categories available after assessment</p>
          )}
          <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
            Indicative retention potential — not an engineering certification.
          </p>
        </section>

        {/* 3. CARBON IMPACT */}
        <section className="rounded-card border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Carbon impact
          </p>
          <p className="text-sm font-semibold text-text-dark mb-1">LCA comparison</p>
          <p className="text-xs text-text-muted mb-3">
            Reuse scenario vs. demolition + new build
          </p>
          <div className="rounded-lg border border-dashed border-gray-200 bg-background px-3 py-2">
            <p className="text-xs font-medium text-text-muted">
              Calculation available after assessment
            </p>
          </div>
          {esg?.potentialCO2Reduction && (
            <p className="text-[11px] text-text-muted mt-2">
              Dataset note: {esg.potentialCO2Reduction}
            </p>
          )}
        </section>

        {/* 4. FINANCING READINESS */}
        <section className="rounded-card border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Financing readiness
          </p>
          <h3 className="text-sm font-semibold text-text-dark mb-3">Green financing pathway</h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-medium">
              Screening
            </span>
            <span className="text-text-muted" aria-hidden="true">
              →
            </span>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-medium">
              Verification
            </span>
            <span className="text-text-muted" aria-hidden="true">
              →
            </span>
            <span className="rounded-full bg-accent/20 text-text-dark px-2.5 py-1 font-medium">
              Financing documentation
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Structures upgrade data for certified verification and green financing assessment.
          </p>
        </section>

        {/* Circular Material Potential */}
        <section
          id="circular-material-potential"
          className="rounded-card border border-gray-200 bg-white p-4"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
            Circular Material Potential
          </p>

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-xs font-semibold text-text-dark mb-1.5">Retain in-situ</p>
              {retainInSitu.length > 0 ? (
                <ul className="space-y-1">
                  {retainInSitu.map((item) => (
                    <li key={item} className="text-xs text-text-muted leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-text-muted">Available after assessment</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-text-dark mb-1.5">Reuse ex-situ</p>
              {reuseExSitu.length > 0 ? (
                <ul className="space-y-1">
                  {reuseExSitu.map((item) => (
                    <li key={item} className="text-xs text-text-muted leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-text-muted">Available after assessment</p>
              )}
            </div>
          </div>

          {esg?.reusableMaterialsValue && (
            <p className="text-[11px] text-text-muted mb-3">
              Dataset note: {esg.reusableMaterialsValue}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate(`/building/${building.id}`)}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View material potential
          </button>
        </section>

        <button
          type="button"
          onClick={() => navigate(`/building/${building.id}`)}
          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          View full building details
        </button>
      </div>
    </div>
  );
};

export default BuildingCard;
