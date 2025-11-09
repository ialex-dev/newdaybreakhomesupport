// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Download from './pages/Download';
import { SERVER_URL } from './pages/config';

type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'why-choose-us'
  | 'careers'
  | 'contact'
  | 'login'
  | 'admin-dashboard'
  | 'employee-dashboard';

type Role = 'admin' | 'employee' | null;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<Role>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Helper: call /api/me with a token and return user JSON or null
  const fetchCurrentUserWithToken = useCallback(async (tokenKey: 'adminToken'|'employeeToken') => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return null;
    try {
      const res = await fetch(`${SERVER_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('fetchCurrentUserWithToken error', err);
      return null;
    }
  }, []);

  // On mount: verify any stored tokens and route accordingly
  useEffect(() => {
    (async () => {
      // 1) Check admin token first
      const adminUser = await fetchCurrentUserWithToken('adminToken');
      if (adminUser && adminUser.role === 'admin') {
        setUserRole('admin');
        setIsAdminAuthenticated(true);
        setCurrentPage('admin-dashboard');
        setIsInitializing(false);
        return;
      } else if (adminUser === null && localStorage.getItem('adminToken')) {
        localStorage.removeItem('adminToken');
      }

      // 2) Check employee token
      const empUser = await fetchCurrentUserWithToken('employeeToken');
      if (empUser && empUser.role === 'employee') {
        setUserRole('employee');
        setCurrentPage('employee-dashboard');
        setIsInitializing(false);
        return;
      } else if (empUser === null && localStorage.getItem('employeeToken')) {
        localStorage.removeItem('employeeToken');
      }

      // default to home if no valid session
      setUserRole(null);
      setIsInitializing(false);
    })();
  }, [fetchCurrentUserWithToken]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'why-choose-us':
        return <WhyChooseUsPage />;
      case 'careers':
        return <CareersPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setUserRole={setUserRole} setIsAdminAuthenticated={setIsAdminAuthenticated} />;
      case 'admin-dashboard':
        return userRole === 'admin' ? (
          <AdminDashboard setCurrentPage={setCurrentPage} setIsAdminAuthenticated={setIsAdminAuthenticated} />
        ) : (
          <LoginPage setCurrentPage={setCurrentPage} setUserRole={setUserRole} setIsAdminAuthenticated={setIsAdminAuthenticated} />
        );
      case 'employee-dashboard':
        return userRole === 'employee' ? (
          <EmployeeDashboard />
        ) : (
          <LoginPage setCurrentPage={setCurrentPage} setUserRole={setUserRole} setIsAdminAuthenticated={setIsAdminAuthenticated} />
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const publicPages: Page[] = ['home', 'about', 'services', 'why-choose-us', 'careers', 'contact'];
  const showLayout = publicPages.includes(currentPage);

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showLayout && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <main>{renderPage()}</main>
      {showLayout && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;