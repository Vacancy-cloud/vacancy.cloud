import { useEffect, useState } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import BeforeAfterSlider from './BeforeAfterSlider';

const POSITION_MIN = 25;
const POSITION_MAX = 65;
const POSITION_STATIC = 40;
const ANIMATION_MS = 5500;

const EnergyPerformanceScale = () => {
  const [currentPosition, setCurrentPosition] = useState(POSITION_STATIC);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let startedAt = 0;

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const t = (elapsed % ANIMATION_MS) / ANIMATION_MS;
      const mid = (POSITION_MIN + POSITION_MAX) / 2;
      const amplitude = (POSITION_MAX - POSITION_MIN) / 2;
      setCurrentPosition(mid + amplitude * Math.sin(t * Math.PI * 2));
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      stop();
      startedAt = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const applyPreference = () => {
      if (media.matches) {
        stop();
        setCurrentPosition(POSITION_STATIC);
      } else {
        start();
      }
    };

    applyPreference();
    media.addEventListener('change', applyPreference);

    return () => {
      stop();
      media.removeEventListener('change', applyPreference);
    };
  }, []);

  const leftFlex = Math.max(currentPosition, 0);
  const rightFlex = Math.max(100 - currentPosition, 0);

  return (
    <div
      className="w-full"
      style={{ ['--current-position' as string]: `${currentPosition}%` }}
      role="img"
      aria-label="Energy performance scale with a moving current-building marker between F/G and B/A."
    >
      <div className="relative w-full pt-8">
        <div className="flex w-full items-stretch">
          <div
            className="flex h-11 min-w-0 items-center justify-center rounded-full px-3 sm:h-12"
            style={{
              flexGrow: leftFlex,
              flexShrink: 1,
              flexBasis: 0,
              background: 'linear-gradient(90deg, #8B1235 0%, #D4212C 48%, #E8732A 100%)',
            }}
          >
            <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white sm:text-base">
              F / G
            </span>
          </div>

          {/* Gap + marker travel together as one unit */}
          <div className="relative mx-1.5 flex w-0 shrink-0 flex-col items-center justify-stretch sm:mx-2">
            <div className="absolute bottom-full mb-1 flex flex-col items-center">
              <span className="whitespace-nowrap text-[11px] font-medium text-text-dark/70 sm:text-xs">
                Current building
              </span>
              <svg
                className="mt-0.5 h-2 w-2.5 text-text-dark/55"
                viewBox="0 0 10 8"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 8L0 0h10L5 8z" />
              </svg>
            </div>
            <div className="h-11 w-[2px] rounded-full bg-text-dark/50 sm:h-12" aria-hidden="true" />
          </div>

          <div
            className="flex h-11 min-w-0 items-center justify-center rounded-full px-3 sm:h-12"
            style={{
              flexGrow: rightFlex,
              flexShrink: 1,
              flexBasis: 0,
              background: 'linear-gradient(90deg, #E6C93A 0%, #9FCB3C 50%, #2F9B4A 100%)',
            }}
          >
            <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white sm:text-base">
              B / A
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex w-full justify-between gap-4 text-xs text-text-muted sm:text-sm">
        <span>Low energy performance</span>
        <span className="text-right">Higher energy performance</span>
      </div>

      <div className="mt-4 text-left">
        <p className="text-[2.4rem] font-bold leading-none tracking-tight text-text-dark lg:text-[2.625rem]">
          133,847
        </p>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-text-muted">
          existing non-residential buildings built in 1960–1979 in Denmark
        </p>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(48,122,225,0.1),transparent_50%)]" />

      <div className="relative z-10 mx-auto w-full max-w-site px-4 py-12 text-left sm:px-6 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
        {/* Desktop: stretch columns so slider bottom = Book a demo bottom */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-16">
          <div className="flex flex-col">
            <div className="flex w-max max-w-full flex-col">
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-text-dark sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl">
                Plan the path to a
                <br />
                <span className="text-primary">higher energy class.</span>
              </h1>

              <p className="mb-4 w-0 min-w-full text-lg leading-relaxed text-text-muted sm:text-xl">
                Vacancy.Cloud identifies energy-performance gaps and the improvements needed to
                upgrade existing buildings.
              </p>

              <div className="flex w-0 min-w-full flex-col gap-4">
                <EnergyPerformanceScale />
                <div>
                  <button
                    type="button"
                    onClick={() => smoothScrollTo('contact')}
                    className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
                  >
                    Book a demo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stretched grid cell: slider fills to shared bottom baseline with CTA (desktop) */}
          <div className="relative min-h-[220px] w-full sm:min-h-[260px] lg:min-h-0">
            <div className="h-full min-h-[220px] sm:min-h-[260px] lg:absolute lg:inset-0 lg:min-h-0">
              <BeforeAfterSlider
                embedded
                className="!min-h-[220px] h-full w-full sm:!min-h-[260px] lg:!min-h-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
