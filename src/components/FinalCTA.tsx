import { smoothScrollTo } from '../utils/smoothScroll';

const FinalCTA = () => {
  return (
    <section id="final-cta" className="py-16 sm:py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark text-center leading-tight mb-4 max-w-3xl mx-auto">
          Understand the building before deciding what comes next.
        </h2>

        <p className="text-center text-text-muted text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Start with an early-stage view of performance gaps, renovation potential and the
          information that still needs verification.
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => smoothScrollTo('demo')}
            className="px-10 py-4 bg-accent text-text-dark rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors shadow-md"
          >
            Explore the demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
