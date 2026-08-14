import { useState } from 'react';

const Team = () => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const founders = [
    {
      name: 'Iaroslava Komissarova',
      role: 'Co-founder',
      title: 'Architect • Independent researcher • Cand. Arch MAA',
      bio: 'Co-founder @ Vacancy.Cloud • Independent researcher • Cand. Arch MAA',
      photo: '/images/founders/Yasya.jpg',
      initials: 'IK',
    },
    {
      name: 'Haya Ghaleb Termanini',
      role: 'Co-Founder',
      title: 'Constructing Architect • BIM/ICT Leader • Storyteller',
      bio: 'Co-Founder @ Vacancy.Cloud • BIM/ICT Leader • Storyteller • Board member @ Building Diversity',
      photo: '/images/founders/Haya.jpg',
      initials: 'HGT',
    },
  ];

  return (
    <section id="team" className="py-20 bg-background">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          The Team
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
          Building decision support for owners, investors, and developers upgrading aging assets
        </p>

        {/* Founder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="bg-white rounded-card p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {imageErrors[index] ? (
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/10">
                      <span className="text-2xl font-bold text-primary">{founder.initials}</span>
                    </div>
                  ) : (
                    <img
                      src={founder.photo}
                      alt={`${founder.name} - ${founder.role}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                      onError={() => setImageErrors((prev) => ({ ...prev, [index]: true }))}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-dark mb-1">{founder.name}</h3>
                  <p className="text-accent font-semibold mb-2">{founder.role}</p>
                  {founder.title && (
                    <p className="text-sm text-text-muted mb-3">{founder.title}</p>
                  )}
                  <p className="text-text-muted leading-relaxed text-sm">{founder.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-card p-8 shadow-md">
            <h3 className="text-2xl font-bold text-text-dark mb-4 text-center">Our Mission</h3>
            <p className="text-text-muted leading-relaxed text-center">
              Aging buildings can be upgraded rather than replaced. Vacancy.Cloud helps property owners,
              real estate investors, developers, and asset managers evaluate energy renovation, structural
              retention, selective dismantling, circular material reuse, and green financing — so capital
              decisions reduce operational and embodied carbon while protecting asset value. Engineers,
              energy auditors, demolition contractors, material recyclers, and financial institutions use
              the same evidence base to execute and fund those pathways.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;

