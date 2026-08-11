import { smoothScrollTo } from '../utils/smoothScroll';

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(48,122,225,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-6 tracking-tight">
          Vacancy.Cloud
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-dark mb-6 leading-tight">
          Upgrade aging buildings.
          <br />
          <span className="text-primary">Preserve what matters.</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-text-muted mb-12 max-w-4xl mx-auto leading-relaxed">
          AI-driven decision platform helping property owners and developers upgrade
          low-performing existing buildings from F/G toward A/B energy performance — while
          retaining existing structures and supporting access to green financing.
        </p>

        {/* Transformation indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-8 text-lg sm:text-xl md:text-2xl font-semibold">
          <span className="text-text-muted">F / G</span>
          <span className="text-primary" aria-hidden="true">
            →
          </span>
          <span className="text-primary">Vacancy.Cloud</span>
          <span className="text-primary" aria-hidden="true">
            →
          </span>
          <span className="text-text-dark">A / B</span>
        </div>

        {/* Benefit labels */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 text-sm sm:text-base text-text-muted">
          <span>↓ Operational Carbon</span>
          <span>↓ Embodied Carbon</span>
          <span>↑ Asset Value</span>
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={() => smoothScrollTo('workflow')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore how it works
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
