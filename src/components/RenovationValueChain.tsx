import { smoothScrollTo } from '../utils/smoothScroll';

const RenovationValueChain = () => {
  const stakeholders = [
    {
      label: 'Property owners & developers',
      title: 'What should we do with this building?',
      problem:
        'Before acquisition or renovation, teams need to understand whether an aging asset should be upgraded, partially dismantled or fundamentally repositioned.',
      value:
        'Screen energy upgrade potential, structural retention, carbon impact and renovation risks before committing to a strategy.',
      outputs: ['Portfolio screening', 'Upgrade pathway', 'Investment decision'],
    },
    {
      label: 'Engineers & energy auditors',
      title: 'What needs professional verification?',
      problem:
        'Building information is fragmented across registries, documents, energy data and site observations.',
      value:
        'Structures early-stage building analysis and prepares inputs for technical verification, energy assessment and Renovation Passport workflows.',
      outputs: ['Structured building data', 'Audit preparation', 'Renovation Passport inputs'],
    },
    {
      label: 'Demolition & material actors',
      title: 'What can stay — and what can move?',
      problem:
        'Reusable components are often identified too late, when demolition planning has already begun.',
      value:
        'Maps retention potential, selective dismantling requirements and future secondary material flows earlier in the project timeline.',
      outputs: ['Selective dismantling', 'Material mapping', 'Circular Material Futures'],
    },
  ];

  const metrics = [
    { label: 'Time', text: 'Faster early-stage screening' },
    { label: 'Risk', text: 'Earlier visibility of renovation constraints' },
    { label: 'Value', text: 'More informed retention and investment decisions' },
  ];

  return (
    <section id="renovation-value-chain" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary mb-3">
          Built for the renovation value chain
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          One building. Different decisions.
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
          Vacancy.Cloud creates a shared decision layer for the stakeholders involved in upgrading
          aging buildings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {stakeholders.map((card) => (
            <article
              key={card.label}
              className="flex flex-col rounded-card border border-gray-200 bg-white p-6 shadow-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-4">
                {card.label}
              </p>
              <h3 className="text-xl font-bold text-text-dark leading-snug mb-4">
                {card.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">{card.problem}</p>
              <p className="text-sm text-text-dark leading-relaxed mb-5 flex-1">
                <span className="font-semibold text-primary">Vacancy.Cloud: </span>
                {card.value}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {card.outputs.map((output, index) => (
                  <span
                    key={output}
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      index === card.outputs.length - 1
                        ? 'border-accent/30 bg-accent/15 text-text-dark'
                        : 'border-primary/20 bg-primary/5 text-text-dark'
                    }`}
                  >
                    {output}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Commercial value strip */}
        <div className="rounded-card border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">
                Make the expensive decisions earlier.
              </h3>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Use early-stage building intelligence before detailed engineering, demolition
                planning and financing processes begin.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center sm:text-left"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                    {metric.label}
                  </p>
                  <p className="text-sm font-medium text-text-dark leading-snug">{metric.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-text-dark mb-2">Start with one building.</h3>
          <p className="text-text-muted mb-6 leading-relaxed">
            Test Vacancy.Cloud on an existing asset and explore its upgrade, retention and reuse
            potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => smoothScrollTo('demo')}
              className="px-8 py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
            >
              Analyse a building
            </button>
            <button
              type="button"
              onClick={() => smoothScrollTo('demo')}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Explore the demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RenovationValueChain;
