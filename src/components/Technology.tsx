const Technology = () => {
  const roadmapPhases = [
    {
      phase: 'CURRENT',
      title: 'Current Phase',
      items: [
        'Data collection',
        'UX prototype',
        'Municipality partnerships',
      ],
      color: 'bg-primary',
    },
    {
      phase: 'NEXT',
      title: 'Next Phase',
      items: [
        'AI model development',
        'Expanded dataset',
      ],
      color: 'bg-accent',
    },
    {
      phase: 'FUTURE',
      title: 'Future Vision',
      items: [
        'European expansion',
        'API access',
      ],
      color: 'bg-text-muted',
    },
  ];

  return (
    <section id="technology" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Technology & Roadmap
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-3xl mx-auto">
          Our platform leverages cutting-edge GIS integration, AI models, and photogrammetry technology
          to provide comprehensive building analysis and investment insights.
        </p>

        {/* Technology Description */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="bg-background rounded-card p-8 shadow-md">
            <h3 className="text-xl font-bold text-text-dark mb-4">Our Technology Stack</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Vacancy.Cloud combines advanced geospatial data processing with machine learning algorithms
              to analyze building conditions, calculate renovation costs, and predict investment returns.
            </p>
            <ul className="space-y-2 text-text-muted">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span><strong className="text-text-dark">GIS Integration:</strong> Seamless integration with cadastral data and geographic information systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span><strong className="text-text-dark">AI Models:</strong> Risk-scoring and ROI calculation using advanced machine learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span><strong className="text-text-dark">Photogrammetry:</strong> 3D building scans for accurate damage detection and material analysis</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {roadmapPhases.map((phase, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-6 h-6 ${phase.color} rounded-full border-4 border-white shadow-lg`} />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-background rounded-card p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <span className={`px-3 py-1 ${phase.color} text-white text-xs font-semibold rounded-full mr-3`}>
                        {phase.phase}
                      </span>
                      <h3 className="text-xl font-bold text-text-dark">{phase.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-text-muted">
                          <svg className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-2/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;


