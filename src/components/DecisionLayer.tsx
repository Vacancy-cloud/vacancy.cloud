const DecisionLayer = () => {
  const dataInputs = [
    {
      title: 'BBR',
      description: 'Building registry and property information',
    },
    {
      title: 'Energinet DataHub',
      description: 'Actual utility consumption where available',
    },
    {
      title: 'DMI',
      description: 'Climate and environmental context',
    },
    {
      title: 'Building images',
      description: 'Facade and condition analysis',
    },
    {
      title: 'Existing documentation',
      description: 'Plans, reports and technical files',
    },
    {
      title: 'Inspection data',
      description: 'Site observations and technical verification inputs',
    },
  ];

  const engineLayers = [
    'Energy upgrade analysis',
    'Structural retention potential',
    'Computer vision',
    'Hazard-risk prediction',
    'Selective dismantling logic',
    'LCA / carbon comparison',
    'Financing readiness',
  ];

  const decisionOutputs = [
    {
      title: 'Upgrade Pathway',
      description: 'Current energy class → target potential',
      positive: true,
    },
    {
      title: 'Retention Strategy',
      description: 'What can remain in situ',
      positive: true,
    },
    {
      title: 'Selective Dismantling Plan',
      description: 'What must be removed or assessed',
      positive: false,
    },
    {
      title: 'Circular Material Potential',
      description: 'What may be reused ex-situ',
      positive: true,
    },
    {
      title: 'Draft Renovation Passport Inputs',
      description: 'Structured data for certified review',
      positive: false,
    },
    {
      title: 'Green Financing Evidence',
      description: 'Documentation pathway for lender assessment',
      positive: false,
    },
  ];

  return (
    <section id="decision-layer" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          From fragmented building data to one decision layer.
        </h2>
        <p className="text-center text-text-muted text-lg mb-14 max-w-3xl mx-auto">
          Vacancy.Cloud combines public building data, energy information, climate context, images
          and technical documentation to support faster renovation decisions.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr] gap-6 lg:gap-4 items-stretch">
          {/* LEFT — Data Inputs */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Data Inputs
            </h3>
            <div className="flex flex-col gap-3 flex-1">
              {dataInputs.map((item) => (
                <div
                  key={item.title}
                  className="rounded-card border border-gray-200 bg-white p-3.5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-text-dark mb-0.5">{item.title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connector */}
          <div
            className="hidden lg:flex items-center justify-center px-1"
            aria-hidden="true"
          >
            <div className="flex items-center text-primary/40">
              <div className="h-px w-4 bg-primary/30" />
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* CENTER — Engine */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4 text-center lg:text-left">
              Vacancy.Cloud Engine
            </h3>
            <div className="flex-1 rounded-card border-2 border-primary/30 bg-primary/5 p-6 shadow-md">
              <p className="text-2xl font-bold text-primary mb-1">Vacancy.Cloud</p>
              <p className="text-sm font-medium text-text-dark mb-6">
                Decision Intelligence Engine
              </p>
              <ul className="space-y-3">
                {engineLayers.map((layer) => (
                  <li key={layer} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-text-dark leading-snug">{layer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connector */}
          <div
            className="hidden lg:flex items-center justify-center px-1"
            aria-hidden="true"
          >
            <div className="flex items-center text-primary/40">
              <div className="h-px w-4 bg-primary/30" />
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* RIGHT — Decision Outputs */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Decision Outputs
            </h3>
            <div className="flex flex-col gap-3 flex-1">
              {decisionOutputs.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-card border bg-white p-3.5 shadow-sm ${
                    item.positive ? 'border-accent/30' : 'border-gray-200'
                  }`}
                >
                  <p className="text-sm font-semibold text-text-dark mb-0.5">{item.title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-14 text-center text-base sm:text-lg font-medium text-text-dark tracking-tight">
          One building. Multiple datasets. One structured decision pathway.
        </p>
      </div>
    </section>
  );
};

export default DecisionLayer;
