const RetainBeforeDemolish = () => {
  const retainElements = [
    'Concrete frame',
    'Floor slabs',
    'Viable masonry',
    'Selected steel elements',
  ];

  const upgradeElements = [
    'Facade',
    'Insulation',
    'Windows',
    'Technical systems',
    'Heating / ventilation',
  ];

  const removeElements = [
    'Damaged envelope components',
    'PCB risk areas',
    'Asbestos risk areas',
    'Non-reusable components',
  ];

  return (
    <section id="retain-before-demolish" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Retain before you demolish.
        </h2>
        <p className="text-center text-text-muted text-lg mb-6 max-w-3xl mx-auto">
          Energy renovation should improve operational performance without discarding the embodied
          carbon already stored in the building.
        </p>

        {/* Priority hierarchy cue */}
        <p className="text-center text-sm font-semibold tracking-wide text-text-dark mb-10">
          <span className="text-accent">Retain</span>
          <span className="text-text-muted mx-2">→</span>
          <span className="text-primary">Upgrade</span>
          <span className="text-text-muted mx-2">→</span>
          <span className="text-text-muted">Remove only where necessary</span>
        </p>

        {/* Decision diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_auto_1fr_auto_0.95fr] gap-4 lg:gap-3 items-stretch mb-10">
          {/* 1. RETAIN — preferred first step */}
          <article className="relative rounded-card border-2 border-accent/40 bg-white p-6 shadow-md flex flex-col">
            <div className="absolute -top-3 left-6">
              <span className="inline-flex rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-dark">
                Preferred first step
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2 mt-1">
              Retain in-situ
            </p>
            <h3 className="text-2xl font-bold text-text-dark mb-2">Retain</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              Keep viable structural elements as part of the upgraded building.
            </p>
            <ul className="space-y-2 mb-5 flex-1">
              {retainElements.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <span className="inline-flex self-start rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-medium text-text-dark">
              Highest circular value
            </span>
            <p className="text-[11px] text-text-muted mt-4 leading-relaxed">
              Indicative retention potential — structural elements potentially retained, subject to
              engineer verification.
            </p>
          </article>

          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <svg className="h-5 w-5 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 2. UPGRADE */}
          <article className="rounded-card border border-primary/25 bg-white p-6 shadow-md flex flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
              Upgrade
            </p>
            <h3 className="text-2xl font-bold text-text-dark mb-2">Upgrade</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              Improve the elements responsible for poor energy performance.
            </p>
            <ul className="space-y-2 flex-1">
              {upgradeElements.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <svg className="h-5 w-5 text-primary/35" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 3. REMOVE / ASSESS — least preferred */}
          <article className="rounded-card border border-red-200/80 bg-white p-6 shadow-sm flex flex-col opacity-95">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-700/70 mb-2">
              Remove / assess
            </p>
            <h3 className="text-2xl font-bold text-text-dark mb-2">Remove or assess</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              Only remove elements that are failing, inefficient or contaminated.
            </p>
            <ul className="space-y-2 flex-1">
              {removeElements.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/70" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Carbon logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <article className="rounded-card border border-primary/20 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
              Operational carbon
            </p>
            <h3 className="text-lg font-bold text-text-dark mb-2">Improve performance</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Reduce operational emissions through better envelope performance and technical systems.
            </p>
            <p className="text-sm font-semibold text-text-dark">
              <span className="text-text-muted">F / G</span>
              <span className="text-primary mx-2">→</span>
              <span className="text-accent">A / B</span>
            </p>
          </article>

          <article className="rounded-card border border-accent/30 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
              Embodied carbon
            </p>
            <h3 className="text-lg font-bold text-text-dark mb-2">Preserve existing carbon value</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Avoid unnecessary new material production by retaining viable concrete, masonry and
              steel.
            </p>
            <p className="text-sm font-semibold text-text-dark">
              <span className="text-text-muted">Existing structure</span>
              <span className="text-accent mx-2">→</span>
              <span>retained</span>
            </p>
          </article>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-text-dark max-w-3xl mx-auto leading-relaxed">
          The goal is not to renovate more.
          <br className="hidden sm:block" />
          It is to intervene where it creates the most value — and preserve what already works.
        </p>
      </div>
    </section>
  );
};

export default RetainBeforeDemolish;
