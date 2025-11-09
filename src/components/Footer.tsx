import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

function PolicyModal({ isOpen, onClose, type }: PolicyModalProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const privacyContent = [
    {
      id: 'intro',
      title: 'Introduction',
      content: 'New Daybreak Home Support ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.'
    },
    {
      id: 'collect',
      title: 'Information We Collect',
      content: 'We collect information you voluntarily provide, such as when you contact us or request services. This may include your name, email address, phone number, address, and health-related information necessary to provide care. We also automatically collect certain information about your device and browsing activities.'
    },
    {
      id: 'use',
      title: 'How We Use Your Information',
      content: 'We use your information to provide, maintain, and improve our services; communicate with you; process transactions; and comply with legal obligations. Your information helps us better understand your needs and deliver personalized care.'
    },
    {
      id: 'security',
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.'
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      content: 'You have the right to access, correct, or delete your personal information. You may also opt-out of marketing communications. To exercise these rights, please contact us using the information provided below.'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: 'If you have questions about this Privacy Policy, please contact us at privacy@newdaybreakhomesupport.com or call us at +1- 253-337-6227.'
    }
  ];

  const termsContent = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: 'By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      id: 'services',
      title: 'Services Description',
      content: 'New Daybreak Home Support provides in-home care services including personal care assistance, companionship, and support services. All services are subject to availability and our assessment of your care needs.'
    },
    {
      id: 'limitations',
      title: 'Limitations of Liability',
      content: 'To the fullest extent permitted by law, New Daybreak Home Support shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the services, even if we have been advised of the possibility of such damages.'
    },
    {
      id: 'warranty',
      title: 'Disclaimer of Warranties',
      content: 'The services are provided "as is" and "as available" without any representations or warranties, express or implied. We do not warrant that the services will be uninterrupted or error-free.'
    },
    {
      id: 'governing',
      title: 'Governing Law',
      content: 'These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which our services are provided, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.'
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Changes will be effective upon posting to the website. Your continued use of the services following the posting of revised terms means that you accept and agree to the changes.'
    }
  ];

  const content = type === 'privacy' ? privacyContent : termsContent;
  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-yellow-50 border-b-2 border-yellow-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {content.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
              >
                <h3 className="font-semibold text-gray-700">{section.title}</h3>
                <ChevronDown
                  size={20}
                  className={`transition-transform text-yellow-600 ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSections.includes(section.id) && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PolicyButton({ type, onClick }: { type: 'privacy' | 'terms'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-yellow-600 transition-colors duration-200"
    >
      {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
    </button>
  );
}

// Updated Footer Component
interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

function Footer({ setCurrentPage }: FooterProps) {
  const [openPolicy, setOpenPolicy] = React.useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-white border-t-2 border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quote */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 italic font-light">
              "Every sunrise is a new beginning in care."
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            <button
              onClick={() => setCurrentPage?.('careers')}
              className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
            >
              Careers
            </button>
            <span className="text-gray-400">•</span>
            <PolicyButton type="privacy" onClick={() => setOpenPolicy('privacy')} />
            <span className="text-gray-400">•</span>
            <PolicyButton type="terms" onClick={() => setOpenPolicy('terms')} />
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 New Daybreak Home Support. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Policy Modals */}
      <PolicyModal
        isOpen={openPolicy === 'privacy'}
        onClose={() => setOpenPolicy(null)}
        type="privacy"
      />
      <PolicyModal
        isOpen={openPolicy === 'terms'}
        onClose={() => setOpenPolicy(null)}
        type="terms"
      />
    </>
  );
}

export default Footer;