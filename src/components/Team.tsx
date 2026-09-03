import { useState } from 'react';

const Team = () => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const founders = [
    {
      name: 'Iaroslava Komissarova',
      role: 'Co-founder',
      title: 'Architect • Independent researcher • Cand. Arch MAA',
      bio: 'Architecture, real estate development, renovation strategy and regulatory processes.',
      photo: '/images/founders/Yasya.jpg',
      initials: 'IK',
    },
    {
      name: 'Haya Termanini',
      role: 'Co-founder',
      title: 'Constructing Architect • BIM/ICT Leader • Storyteller',
      bio: 'BIM, building transformation, material reuse, data workflows and digital construction.',
      photo: '/images/founders/Haya.jpg',
      initials: 'HT',
    },
  ];

  return (
    <section id="team" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Row 1: Team intro | Our Mission */}
        <div className="mb-14 grid grid-cols-1 gap-10 md:mb-16 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="text-left">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-dark sm:text-4xl md:text-5xl">
              The Team
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              We combine architecture, real estate development, BIM and building transformation to
              build practical decision tools for existing buildings.
            </p>
          </div>

          <div className="text-left">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-dark sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Make renovation decisions easier to start with what is already there. Vacancy.Cloud
              helps teams understand current performance, identify gaps and determine what needs
              deeper investigation before major investment decisions.
            </p>
          </div>
        </div>

        {/* Row 2: Founders */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          {founders.map((founder, index) => (
            <div
              key={founder.name}
              className="rounded-card bg-white p-6 shadow-md sm:p-8"
            >
              <div className="flex flex-col items-start space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <div className="flex-shrink-0">
                  {imageErrors[index] ? (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/10 bg-primary/10">
                      <span className="text-2xl font-bold text-primary">{founder.initials}</span>
                    </div>
                  ) : (
                    <img
                      src={founder.photo}
                      alt={`${founder.name} - ${founder.role}`}
                      className="h-24 w-24 rounded-full border-4 border-primary/10 object-cover"
                      onError={() => setImageErrors((prev) => ({ ...prev, [index]: true }))}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-bold text-text-dark">{founder.name}</h3>
                  <p className="mb-2 font-semibold text-accent">{founder.role}</p>
                  {founder.title && (
                    <p className="mb-3 text-sm text-text-muted">{founder.title}</p>
                  )}
                  <p className="text-sm leading-relaxed text-text-muted">{founder.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
