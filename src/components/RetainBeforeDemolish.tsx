const RetainBeforeDemolish = () => {
  const themes = [
    {
      title: 'Extend building life',
      description: 'Investigate renovation potential before deciding to replace the asset.',
      accent: 'primary' as const,
    },
    {
      title: 'Retain existing structures where feasible',
      description:
        'Identify structural elements that may remain subject to professional verification.',
      accent: 'accent' as const,
    },
    {
      title: 'Reduce unnecessary material replacement',
      description:
        'Surface material-reuse potential early so replacement is considered only where needed.',
      accent: 'primary' as const,
    },
  ];

  return (
    <section id="retain-before-demolish" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Retain before you demolish.
        </h2>
        <p className="text-center text-text-muted text-lg mb-10 max-w-3xl mx-auto">
          Early visibility into energy gaps, structural retention and material-reuse potential helps
          owners investigate renovation before committing to replacement or demolition.
        </p>

        {/* Priority hierarchy cue */}
        <p className="text-center text-sm font-semibold tracking-wide text-text-dark mb-10">
          <span className="text-accent">Retain</span>
          <span className="text-text-muted mx-2">→</span>
          <span className="text-primary">Upgrade</span>
          <span className="text-text-muted mx-2">→</span>
          <span className="text-text-muted">Remove only where necessary</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {themes.map((theme) => (
            <article
              key={theme.title}
              className={`rounded-card border bg-white p-6 shadow-sm flex flex-col ${
                theme.accent === 'accent' ? 'border-accent/40' : 'border-primary/20'
              }`}
            >
              <h3 className="text-xl font-bold text-text-dark mb-3">{theme.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{theme.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetainBeforeDemolish;
