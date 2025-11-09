import React from 'react';
import { Sunrise, Menu, X } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';

type Page = 'home' | 'about' | 'services' | 'why-choose-us' | 'careers' | 'contact' | 'admin-login' | 'admin-dashboard';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', page: 'home' as Page },
    { name: 'About Us', page: 'about' as Page },
    { name: 'Services', page: 'services' as Page },
    { name: 'Why Choose Us', page: 'why-choose-us' as Page },
    { name: 'Careers', page: 'careers' as Page },
    { name: 'Contact', page: 'contact' as Page },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <div className="p-2 rounded-full">
<div>
  <img
    src="https://rising-sun.org/wp-content/uploads/2025/07/fotrs-logo-transparent.webp"
    alt="Caregiver with elderly client"
    className="w-[50px] h-auto object-contain block"
  />
</div>

            </div>
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500 text-xl font-bold">New Daybreak</h1>
              <p className="text-sm text-yellow-600 -mt-1">Home Support</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-yellow-600 ${
                  currentPage === item.page ? 'text-yellow-600' : 'text-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage('careers')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded-full font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply as a Caregiver
            </button>

            {/* Admin Dashboard Button */}
<button
  onClick={() => setCurrentPage('admin-dashboard')}
  className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-all duration-200 shadow-lg relative"
  title="Admin Dashboard"
>
  <LayoutDashboard className="h-5 w-5" />
</button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-yellow-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              {navigation.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 ${
                    currentPage === item.page 
                      ? 'text-yellow-600 bg-yellow-50' 
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage('careers');
                  setIsMenuOpen(false);
                }}
                className="text-left bg-gradient-to-r from-yellow-400 to-blue-600 text-white px-4 py-3 rounded-full font-medium mt-3 hover:from-yellow-500 hover:to-blue-700 transition-all duration-200"
              >
                Apply as a Caregiver
              </button>

              {/* Admin Dashboard Button for Mobile */}
              <button
                onClick={() => {
                  setCurrentPage('admin-dashboard');
                  setIsMenuOpen(false);
                }}
                className="text-left bg-gray-800 text-white px-4 py-3 rounded-full font-medium mt-3 hover:bg-gray-700 transition-all duration-200"
              >
                Admin Dashboard
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
