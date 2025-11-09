import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">New Daybreak</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embracing each new day as a chance to bring comfort, independence, and care into the lives of those we serve.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <img
              src="https://images.pexels.com/photos/7551426/pexels-photo-7551426.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Caregiver with elderly client"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At New Daybreak Home Support, we embrace each new day as a chance to bring comfort, independence, and care into the lives of those we serve. Our compassionate caregivers support clients with dignity and warmth, helping them live fulfilling lives in the comfort of their homes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded on the belief that everyone deserves to age gracefully in their own home, we provide personalized, non-medical care that respects individual needs and preferences. Our team is dedicated to creating meaningful connections that enrich the lives of our clients and their families.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-8 rounded-2xl border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full mr-4 shadow-md">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To provide reliable, compassionate, and respectful home care that enhances quality of life for our clients and peace of mind for their families.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-4 shadow-md">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To be Washington's most trusted, heart-centered home care provider, setting the standard for compassionate, personalized care in our communities.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Compassion", description: "We care deeply about every client's wellbeing and happiness.", color: "from-blue-500 to-sky-500" },
              { title: "Dignity", description: "We treat every person with respect and honor their independence.", color: "from-yellow-400 to-orange-400" },
              { title: "Excellence", description: "We strive for the highest standards in everything we do.", color: "from-cyan-400 to-teal-500" },
              { title: "Trust", description: "We build lasting relationships through honesty and reliability.", color: "from-indigo-400 to-blue-600" }
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`p-4 bg-gradient-to-br ${value.color} rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Heart className="h-8 w-8 text-white mx-auto" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
