import { smoothScrollTo } from '../utils/smoothScroll';

const FinalCTA = () => {
  return (
    <section id="final-cta" className="py-24 sm:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-6 text-center">
          From building risk to upgrade potential
        </p>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-dark text-center leading-tight mb-6">
          Before you replace the building,
          <br />
          understand what it can become.
        </h2>

        <p className="text-center text-text-muted text-base sm:text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
          Vacancy.Cloud helps property owners and renovation teams screen aging buildings, define an
          energy upgrade pathway, preserve viable structures and prepare the evidence needed for
          verification, reuse and financing.
        </p>

        {/* Abstract graphic — quiet conclusion, not a second hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 mb-14">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-text-muted">F / G</p>
            <p className="text-primary text-sm" aria-hidden="true">
              ↓
            </p>
            <p className="text-sm font-bold text-primary">Vacancy.Cloud</p>
            <p className="text-primary text-sm" aria-hidden="true">
              ↓
            </p>
            <p className="text-lg font-semibold text-text-dark">A / B</p>
          </div>

          <div
            className="hidden sm:block h-24 w-px bg-gray-200"
            aria-hidden="true"
          />

          <div className="text-center space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Existing structure
            </p>
            <p className="text-primary text-sm" aria-hidden="true">
              →
            </p>
            <p className="text-lg font-semibold text-accent">Retain</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mb-10">
          <button
            type="button"
            onClick={() => smoothScrollTo('demo')}
            className="px-10 py-4 bg-accent text-text-dark rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors shadow-md"
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

        <p className="text-center text-sm text-text-muted">
          Built for the transition of existing buildings — not their premature replacement.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
