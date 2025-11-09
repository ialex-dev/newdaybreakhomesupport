import React, { useMemo, useCallback, lazy, Suspense } from 'react';

// Lazy-load lucide icons individually to keep bundle small
const Heart = lazy(() => import('lucide-react').then((m) => ({ default: m.Heart })));
const Shield = lazy(() => import('lucide-react').then((m) => ({ default: m.Shield })));
const Clock = lazy(() => import('lucide-react').then((m) => ({ default: m.Clock })));
const ArrowRight = lazy(() => import('lucide-react').then((m) => ({ default: m.ArrowRight })));

type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'why-choose-us'
  | 'careers'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

function IconFallback({ size = 24 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{ width: size, height: size, borderRadius: 6 }}
      className="bg-gray-200"
    />
  );
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  // static data memoized so it's not recreated each render
  const overviewCards = useMemo(
    () => [
      {
        title: 'Compassionate Care',
        description:
          'Our caregivers provide warm, personalized support with genuine compassion.',
        Icon: Heart,
        color: 'from-blue-400 to-sky-500',
      },
      {
        title: 'Trusted Professionals',
        description:
          'Licensed, insured, and thoroughly background-checked caregivers.',
        Icon: Shield,
        color: 'from-indigo-400 to-blue-600',
      },
      {
        title: 'Peace of Mind, Every Day',
        description: 'Reliable care that gives families confidence and comfort.',
        Icon: Clock,
        color: 'from-cyan-400 to-teal-500',
      },
    ],
    []
  );

  // stable handlers using useCallback to avoid recreating on every render
  const goToAbout = useCallback(() => setCurrentPage('about'), [setCurrentPage]);
  const goToContact = useCallback(() => setCurrentPage('contact'), [setCurrentPage]);
  const goToServices = useCallback(() => setCurrentPage('services'), [setCurrentPage]);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Care for You With Every{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-yellow-500">
                  Sunrise
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Providing compassionate, non-medical home support that helps you live independently and with dignity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap">
                <button
                  onClick={goToAbout}
                  className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-sky-700 transition-shadow duration-200 shadow-lg hover:shadow-xl group"
                >
                  Learn More
                  <Suspense fallback={<IconFallback size={20} />}>
                    <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Suspense>
                </button>

                <button
                  onClick={goToContact}
                  className="border-2 border-blue-400 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-150"
                >
                  Contact Us
                </button>
              </div>
            </div>

            <div className="relative">
              {/* use decoding="async" and loading="lazy" for faster paints */}
              <img
                src="https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Caregiver helping elderly person"
                loading="lazy"
                decoding="async"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />

              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg hidden sm:block">
                <p className="text-sm text-gray-600">Trusted by families</p>
                <p className="text-2xl font-bold text-blue-600">across Washington</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW CARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Families Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional home care that makes a real difference in people's lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {overviewCards.map((card) => {
              const { title, description, Icon, color } = card as any; // Icon is a lazy component
              return (
                <article
                  key={title}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} p-4 mb-6 transform-gpu will-change-transform`}>
                    <Suspense fallback={<IconFallback size={32} />}>
                      {/* Icon is a lazy-loaded component */}
                      <Icon className="h-8 w-8 text-white" />
                    </Suspense>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-sky-500 to-yellow-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Experience Compassionate Care?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let us help you or your loved one live independently with dignity and comfort.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToContact}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-150 shadow-lg"
            >
              Get Started Today
            </button>

            <button
              onClick={goToServices}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-150"
            >
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(HomePage);
