const SelectiveDismantling = () => {
  return (
    <section id="selective-dismantling" className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary mb-3">
          When retention is not enough
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-text-dark mb-3">
          Remove less. Recover more.
        </h2>
        <p className="text-center text-text-muted text-base mb-10 max-w-2xl mx-auto">
          Vacancy.Cloud helps identify potential hazardous-material risks and structures selective
          dismantling decisions before renovation begins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-8">
          {/* 01 — SCREEN RISK */}
          <article className="rounded-card border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">01</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Screen risk
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">
              Identify potential risk areas
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
              Combine building age, typology, documentation and inspection inputs to flag components
              that may require further hazardous-material assessment.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['PCB', 'Asbestos', 'Lead', 'Contaminated materials'].map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-text-dark"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed border-t border-gray-100 pt-3">
              Potential risks require professional testing and verification.
            </p>
          </article>

          {/* 02 — SEPARATE */}
          <article className="rounded-card border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">02</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Separate
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">
              Plan selective dismantling
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Separate elements that can remain, require specialist removal, or can enter a reuse
              pathway.
            </p>
            <div className="space-y-2 flex-1">
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-text-dark">
                  Retain
                </p>
                <p className="text-xs text-text-muted">Keep in the building</p>
              </div>
              <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-text-dark">
                  Controlled removal
                </p>
                <p className="text-xs text-text-muted">Requires assessment or specialist handling</p>
              </div>
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-text-dark">
                  Recover
                </p>
                <p className="text-xs text-text-muted">Potential for reuse</p>
              </div>
            </div>
          </article>

          {/* 03 — RECOVER VALUE */}
          <article className="rounded-card border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <span className="text-2xl font-bold text-primary">03</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Recover value
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">
              Create a material pathway
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
              Structure reusable components and materials as secondary resources instead of treating
              the entire building as demolition waste.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-dark mb-3">
              <span className="rounded-md bg-background border border-gray-200 px-2 py-1">Building</span>
              <span className="text-primary" aria-hidden="true">→</span>
              <span className="rounded-md bg-background border border-gray-200 px-2 py-1">Component</span>
              <span className="text-primary" aria-hidden="true">→</span>
              <span className="rounded-md bg-background border border-gray-200 px-2 py-1">Material</span>
              <span className="text-primary" aria-hidden="true">→</span>
              <span className="rounded-md border border-accent/30 bg-accent/15 px-2 py-1">Future use</span>
            </div>
            <span className="inline-flex self-start rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-text-dark">
              Circular Material Futures
            </span>
          </article>
        </div>

        <div className="rounded-card border border-primary/20 bg-primary/5 px-5 py-4 text-center shadow-sm">
          <p className="text-sm sm:text-base font-medium text-text-dark leading-relaxed">
            Selective dismantling is not the starting point.
            <span className="text-text-muted"> </span>
            It is the fallback when retention is no longer viable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SelectiveDismantling;
