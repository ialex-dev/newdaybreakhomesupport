import React from 'react';
import { 
  User, 
  ChefHat, 
  Heart, 
  Home, 
  Pill, 
  Car, 
  UserCheck, 
  Moon,
  Clock
} from 'lucide-react';

function ServicesPage() {
  const services = [
    {
      title: "Personal Care Assistance",
      description: "Help with bathing, dressing, grooming, and other daily personal care needs.",
      icon: User,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Meal Preparation",
      description: "Nutritious meal planning, cooking, and assistance with eating when needed.",
      icon: ChefHat,
      color: "from-green-400 to-green-600"
    },
    {
      title: "Companionship & Emotional Support",
      description: "Friendly conversation, social activities, and emotional comfort to reduce isolation.",
      icon: Heart,
      color: "from-pink-400 to-pink-600"
    },
    {
      title: "Light Housekeeping",
      description: "Assistance with cleaning, laundry, organization, and maintaining a tidy home.",
      icon: Home,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Medication Reminders",
      description: "Non-medical reminders to help clients take medications as prescribed.",
      icon: Pill,
      color: "from-red-400 to-red-600"
    },
    {
      title: "Mobility & Transfer Assistance",
      description: "Safe assistance with walking, transferring, and mobility support.",
      icon: UserCheck,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      title: "Errands & Transportation",
      description: "Grocery shopping, appointment transportation, and running essential errands.",
      icon: Car,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Respite Care for Family Caregivers",
      description: "Temporary relief for family members providing care to their loved ones.",
      icon: Clock,
      color: "from-teal-400 to-teal-600"
    },
    {
      title: "24-Hour & Overnight Care",
      description: "Round-the-clock supervision and assistance for clients requiring continuous care.",
      icon: Moon,
      color: "from-gray-400 to-gray-600"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive, compassionate care tailored to your unique needs and preferences.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Personalized Care Plans
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Every client receives a customized care plan designed specifically for their needs, preferences, and goals. We work closely with families to ensure our services enhance quality of life and promote independence.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
              <p className="text-gray-700">Availability for emergencies</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
              <p className="text-gray-700">Licensed & insured caregivers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">5★</div>
              <p className="text-gray-700">Family satisfaction rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;