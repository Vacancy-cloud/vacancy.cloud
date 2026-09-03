const stages = [
  {
    number: '01',
    title: 'Building Data',
    description:
      'Available building, energy, climate, visual and uploaded data.',
  },
  {
    number: '02',
    title: 'Current Building Profile',
    description:
      'Structures what is known, derived, predicted and still unknown.',
  },
  {
    number: '03',
    title: 'Applicable Target',
    description:
      'Identifies relevant building-specific energy-performance and renovation requirements.',
  },
  {
    number: '04',
    title: 'Performance Gap',
    description:
      'Compares current performance with the applicable target across key building components.',
  },
  {
    number: '05',
    title: 'Renovation Pathway',
    description:
      'Shows improvement areas, critical missing inputs and where targeted verification is needed.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative bg-background pt-3 pb-16 sm:pt-4 sm:pb-20 lg:pt-5">
      <div id="workflow" className="absolute top-0" aria-hidden="true" />

      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Constrain heading to hero left-column width (same 2-col + gaps as Hero) */}
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <h2 className="text-left text-2xl font-bold text-text-dark sm:text-3xl lg:text-[2.15rem] xl:text-[2.35rem] lg:whitespace-nowrap">
            How Vacancy.Cloud Works
          </h2>
        </div>
        <p className="mb-10 max-w-2xl text-left text-lg text-text-muted sm:mb-12">
          From available building data to a clear early-stage renovation pathway.
        </p>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Left — provided diagram PNG */}
          <div className="w-full">
            <img
              src="/images/diagram/diagram.png?v=2"
              alt="Five-stage workflow: Building Data, Current Profile, Applicable Target, Performance Gap, Renovation Pathway"
              className="h-auto w-full"
            />
          </div>

          {/* Right — explanatory text */}
          <div className="flex h-full flex-col justify-center gap-7 sm:gap-8 lg:gap-9">
            {stages.map((stage) => (
              <div key={stage.number}>
                <p className="mb-1.5 text-base font-semibold text-text-dark sm:text-lg">
                  <span className="tabular-nums">{stage.number}</span>
                  <span className="mx-2 text-text-muted/50">—</span>
                  {stage.title}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-[0.95rem]">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
