import React from 'react';
import { Check, Award, Shield, Clock, DollarSign, MapPin, Users } from 'lucide-react';

function WhyChooseUsPage() {
  const reasons = [
    {
      title: "Compassionate, Professional Caregivers",
      description: "Our team is carefully selected for their expertise, empathy, and dedication to providing exceptional care.",
      icon: Users
    },
    {
      title: "Fully Licensed and Insured in Washington",
      description: "We meet all state requirements and maintain comprehensive insurance coverage for your peace of mind.",
      icon: Shield
    },
    {
      title: "Reliable and Flexible Scheduling",
      description: "We adapt to your schedule and needs, providing consistent care when you need it most.",
      icon: Clock
    },
    {
      title: "Personalized Care Plans",
      description: "Every client receives individualized attention with care plans tailored to their unique needs and preferences.",
      icon: Award
    },
    {
      title: "Affordable, Transparent Pricing",
      description: "Clear, honest pricing with no hidden fees. We work with families to find affordable care solutions.",
      icon: DollarSign
    },
    {
      title: "Locally Owned and Community-Focused",
      description: "As a local business, we understand our community's needs and are committed to serving our neighbors.",
      icon: MapPin
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">New Daybreak</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to excellence in every aspect of our care, from our caregivers to our customer service.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <img
              src="https://images.pexels.com/photos/7551464/pexels-photo-7551464.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Happy family with caregiver"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </div>
          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-12 text-center text-white mb-20">
          <h2 className="text-3xl font-bold mb-12">Our Commitment to Excellence</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <p className="text-yellow-100">Years of Experience</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-yellow-100">Families Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-yellow-100">Certified Caregivers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-yellow-100">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Detailed Reasons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
                <reason.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsPage;