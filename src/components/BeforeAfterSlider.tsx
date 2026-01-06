import { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = () => {
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Transformation Impact
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
          See how data-driven decisions transform vacant buildings into valuable assets
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-card overflow-hidden shadow-lg"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Before Image (Background) */}
            <div className="absolute inset-0">
              <img
                src="/images/before-after/before.png"
                alt="Before transformation"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* After Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="/images/before-after/after.png"
                alt="After transformation"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-grab active:cursor-grabbing"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-primary">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
              After
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center text-text-muted text-sm mt-4">
            Drag the slider to compare before and after
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;

