import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { SERVER_URL } from './config';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will contact you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">New Daybreak</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to answer your questions and help you find the right care solution for your family.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-700">+1- 253-337-6227</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-700">info@newdaybreakhomesupport.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-700">Seattle, WA</p>
                    <p className="text-sm text-gray-600 mt-1">Serving the Greater Seattle Area</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-yellow-200">
                <div className="flex items-start">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Office Hours</p>
                    <div className="text-gray-700 space-y-1">
                      <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
                      <p>Saturday: 9:00 AM – 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <p className="text-sm text-yellow-600 mt-2 font-medium">
                      24/7 emergency support available for existing clients
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meet Our Director</h3>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/7551653/pexels-photo-7551653.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                  alt="Mitchelle Macharia"
                  className="w-50 h-50 rounded-3xl object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">Mitchelle Macharia</p>
                  <p className="text-gray-600">Director</p>
                  {/* <p className="text-sm text-blue-600 mt-1">15+ years in home care</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="personal-care">Personal Care Assistance</option>
                    <option value="companionship">Companionship</option>
                    <option value="housekeeping">Light Housekeeping</option>
                    <option value="meal-prep">Meal Preparation</option>
                    <option value="transportation">Transportation</option>
                    <option value="overnight">Overnight Care</option>
                    <option value="respite">Respite Care</option>
                    <option value="consultation">Free Consultation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your care needs or ask any questions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  Send Message
                  <Send className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-gray-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Serving the Greater Seattle Area</h3>
            <p className="text-gray-600 mb-6">
              We provide compassionate home care services throughout Seattle and surrounding communities.
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-12 text-white">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <p className="text-xl font-semibold">Interactive Map Coming Soon</p>
              <p className="text-yellow-100 mt-2">
                Contact us to confirm service availability in your specific area
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;