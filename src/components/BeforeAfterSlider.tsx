import { useState, useRef, useEffect } from 'react';

type BeforeAfterSliderProps = {
  /** Compact slider for hero / embed contexts (no section chrome) */
  embedded?: boolean;
  className?: string;
};

const Slider = ({ embedded = false, className = '' }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      setSliderPosition(clampedPercentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      setSliderPosition(clampedPercentage);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden shadow-lg ${
        embedded
          ? `h-full min-h-[260px] sm:min-h-[320px] rounded-xl ${className}`
          : `aspect-video rounded-card ${className}`
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      role="img"
      aria-label="Before and after building comparison. Drag to compare."
    >
      {/* After (renovated) — full background, visible on the right */}
      <div className="absolute inset-0">
        <img
          src="/images/before-after/after.png"
          alt="After renovation"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Before (existing) — clipped to the left of the handle */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src="/images/before-after/before.png"
          alt="Before renovation"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 cursor-grab bg-white shadow-md active:cursor-grabbing"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-white shadow-lg sm:h-12 sm:w-12 sm:border-4">
          <svg
            className="h-5 w-5 text-primary sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      <div className="absolute left-3 top-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white sm:left-4 sm:top-4 sm:px-4 sm:py-2 sm:text-sm">
        Before
      </div>
      <div className="absolute right-3 top-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-4 sm:py-2 sm:text-sm">
        After
      </div>
    </div>
  );
};

const BeforeAfterSlider = ({ embedded = false, className = '' }: BeforeAfterSliderProps) => {
  if (embedded) {
    return <Slider embedded className={className} />;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-text-dark sm:text-4xl md:text-5xl">
          Transformation Impact
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-text-muted">
          See how data-driven decisions upgrade aging buildings while preserving structure and value
        </p>

        <div className="relative mx-auto max-w-5xl">
          <Slider className={className} />
          <p className="mt-4 text-center text-sm text-text-muted">
            Drag the slider to compare before and after
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
