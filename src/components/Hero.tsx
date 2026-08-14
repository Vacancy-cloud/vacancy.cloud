import { smoothScrollTo } from '../utils/smoothScroll';

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background — keep subtle light blue / off-white */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(48,122,225,0.1),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-dark mb-6 leading-[1.1] tracking-tight">
            Upgrade aging buildings.
            <br />
            <span className="text-primary">Preserve what matters.</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-xl leading-relaxed">
            We help upgrade low-performing existing buildings from F/G toward A/B energy
            performance.
          </p>

          <button
            type="button"
            onClick={() => smoothScrollTo('contact')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            Book a demo
          </button>
        </div>

        {/* Transformation block */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 mb-10">
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-muted">
              F / G
            </span>
            <span className="text-2xl sm:text-3xl text-primary font-light" aria-hidden="true">
              →
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              Vacancy.Cloud
            </span>
            <span className="text-2xl sm:text-3xl text-primary font-light" aria-hidden="true">
              →
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-dark">
              A / B
            </span>
          </div>

          {/* Value indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <div>
                <p className="text-base sm:text-lg font-semibold text-text-dark">
                  ↓ Operational Carbon
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div>
                <p className="text-base sm:text-lg font-semibold text-text-dark">
                  ↓ Embodied Carbon
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 text-accent shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <div>
                <p className="text-base sm:text-lg font-semibold text-text-dark">
                  ↑ Asset Value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
