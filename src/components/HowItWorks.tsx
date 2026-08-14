const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      phase: 'SCREEN',
      title: 'Screen the building',
      description:
        'Combine building data, actual energy performance, climate data, images and existing documentation to assess upgrade potential and structural viability.',
      labels: ['BBR', 'Energinet', 'DMI', 'Images', 'Documents'],
      accent: 'primary' as const,
    },
    {
      number: '02',
      phase: 'DECIDE',
      title: 'Define the upgrade strategy',
      description:
        'Model the pathway from low energy performance toward A/B and identify what should be retained, upgraded, replaced or selectively dismantled.',
      labels: ['Energy upgrade', 'Structural retention', 'Hazard risk', 'Selective dismantling'],
      accent: 'primary' as const,
    },
    {
      number: '03',
      phase: 'VERIFY',
      title: 'Prepare verification',
      description:
        'Structure the data required for a draft Renovation Passport, LCA documentation and certified energy-auditor review.',
      labels: ['Renovation Passport', 'LCA', 'MEPS', 'EU Taxonomy'],
      accent: 'primary' as const,
    },
    {
      number: '04',
      phase: 'FINANCE & REUSE',
      title: 'Unlock the next step',
      description:
        'Translate verified improvements into evidence for green financing while identifying reusable materials for future projects.',
      labels: ['Green financing', 'Material Futures', 'Reuse flows'],
      accent: 'accent' as const,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-background">
      {/* Anchor for Hero CTA without changing navigation targets */}
      <div id="workflow" className="absolute top-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-left text-text-dark mb-4">
          How Vacancy.Cloud works
        </h2>
        <p className="text-left text-text-muted text-lg mb-12 max-w-2xl">
          From existing building data to a verified renovation and financing pathway.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {steps.map((step, index) => {
            const isFinal = step.accent === 'accent';
            const numberColor = isFinal ? 'text-accent' : 'text-primary';
            const phaseColor = isFinal ? 'text-accent' : 'text-primary';
            const pillClass = isFinal
              ? 'bg-accent/15 text-text-dark border-accent/30'
              : 'bg-primary/10 text-text-dark border-primary/20';
            const hoverNumber = isFinal ? 'group-hover:text-accent' : 'group-hover:text-primary';

            return (
              <div key={step.number} className="relative flex h-full">
                <article
                  className="group flex h-full w-full flex-col rounded-card bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span
                      className={`text-4xl font-bold leading-none transition-colors duration-200 ${numberColor} ${hoverNumber}`}
                    >
                      {step.number}
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${phaseColor}`}
                    >
                      {step.phase}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-text-dark">
                    {step.title}
                  </h3>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {step.labels.map((label) => (
                      <span
                        key={label}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${pillClass}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </article>

                {/* Desktop sequence connectors */}
                {index < steps.length - 1 && (
                  <div
                    className="pointer-events-none absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      className={`h-5 w-5 ${isFinal ? 'text-accent/50' : 'text-primary/40'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
