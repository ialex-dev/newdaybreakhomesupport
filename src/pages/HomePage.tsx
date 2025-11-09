import React from 'react';
import { Heart, Shield, Clock, ArrowRight } from 'lucide-react';

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

function HomePage({ setCurrentPage }: HomePageProps) {
  const overviewCards = [
    {
      title: "Compassionate Care",
      description: "Our caregivers provide warm, personalized support with genuine compassion.",
      icon: Heart,
      color: "from-blue-400 to-sky-500"
    },
    {
      title: "Trusted Professionals", 
      description: "Licensed, insured, and thoroughly background-checked caregivers.",
      icon: Shield,
      color: "from-indigo-400 to-blue-600"
    },
    {
      title: "Peace of Mind, Every Day",
      description: "Reliable care that gives families confidence and comfort.",
      icon: Clock,
      color: "from-cyan-400 to-teal-500"
    }
  ];



  return (
    <div className="bg-white">
      {/* Hero Section */}
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
                  onClick={() => setCurrentPage('about')}
                  className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  Learn More
                  <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button
                  onClick={() => setCurrentPage('contact')}
                  className="border-2 border-blue-400 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200"
                >
                  Contact Us
                </button>


              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Caregiver helping elderly person"
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

      {/* Quick Overview Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Families Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional home care that makes a real difference in people's lives.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {overviewCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-sky-500 to-yellow-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Experience Compassionate Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let us help you or your loved one live independently with dignity and comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg"
            >
              Get Started Today
            </button>
            <button
              onClick={() => setCurrentPage('services')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
