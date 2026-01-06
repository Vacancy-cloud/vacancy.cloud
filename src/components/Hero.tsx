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
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-dark mb-6 leading-tight">
          Turning Data into
          <br />
          <span className="text-primary">Effective Decisions</span>
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl text-text-muted mb-12 max-w-4xl mx-auto">
          AI-Platform for managing Vacant and Underutilized Buildings in Denmark
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => smoothScrollTo('demo')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Demo
          </button>
          <button
            onClick={() => smoothScrollTo('contact')}
            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold text-lg hover:bg-primary/5 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;


