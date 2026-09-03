const DecisionLayer = () => {
  const outputs = [
    {
      title: 'Current building status',
      items: ['Energy baseline', 'Building typology', 'Available component data'],
    },
    {
      title: 'Performance gaps',
      items: [
        'Roof',
        'Exterior walls',
        'Windows',
        'Floor / basement',
        'Heating',
        'Ventilation',
      ],
    },
    {
      title: 'Data confidence',
      items: ['Known', 'Derived', 'Predicted', 'Unknown'],
    },
    {
      title: 'Next steps',
      items: [
        'Required improvement areas',
        'Missing critical inputs',
        'Targeted verification',
        'Professional review where needed',
      ],
    },
  ];

  return (
    <section id="decision-layer" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          From fragmented building data to one decision layer.
        </h2>
        <p className="text-center text-text-muted text-lg mb-14 max-w-3xl mx-auto">
          Vacancy.Cloud turns scattered building information into a structured early-stage
          assessment — showing current performance, improvement gaps, data confidence and what
          still needs verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {outputs.map((block) => (
            <article
              key={block.title}
              className="rounded-card border border-gray-200 bg-white p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                {block.title}
              </h3>
              <ul className="space-y-2.5 flex-1">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-text-dark leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DecisionLayer;
