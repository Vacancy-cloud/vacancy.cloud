const RenovationValueChain = () => {
  const journeys = [
    {
      label: 'Portfolio owner',
      support:
        'Screen existing assets and identify where deeper renovation assessment is most relevant.',
      flow: [
        'Building portfolio',
        'Early-stage screening',
        'Performance gaps',
        'Data confidence',
        'Prioritise which assets need deeper investigation',
      ],
    },
    {
      label: 'Investor / developer',
      support:
        'Understand renovation potential and key uncertainties before detailed due diligence.',
      flow: [
        'Potential acquisition',
        'Early-stage screening',
        'Performance gaps',
        'Critical unknowns',
        'Proceed to professional due diligence with clearer risk visibility',
      ],
    },
  ];

  return (
    <section id="renovation-value-chain" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          One building. Different decisions.
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
          Two journeys. One Vacancy.Cloud assessment — used to inform next steps, not to replace
          professional or investment decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {journeys.map((journey) => (
            <article
              key={journey.label}
              className="flex flex-col rounded-card border border-gray-200 bg-white p-6 sm:p-8 shadow-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
                {journey.label}
              </p>
              <p className="text-sm text-text-muted leading-relaxed mb-6">{journey.support}</p>

              <ol className="space-y-3 flex-1">
                {journey.flow.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-text-dark leading-snug">{step}</p>
                      {index < journey.flow.length - 1 && (
                        <p className="text-xs text-primary/50 mt-1" aria-hidden="true">
                          ↓
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RenovationValueChain;
