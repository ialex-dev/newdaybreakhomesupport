// src/LoginPage.tsx
import React, { useState } from 'react';
import { Sunrise, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { SERVER_URL } from './config';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
  setIsAdminAuthenticated?: (authenticated: boolean) => void;
}

interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
  message?: string;
}

export default function LoginPage({ setCurrentPage, setIsAdminAuthenticated }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${SERVER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await res.json().catch(() => ({} as LoginResponse));

      if (!res.ok) {
        setError(data?.message || `Login failed (${res.status})`);
        setIsLoading(false);
        return;
      }

      // require admin role
      const role = data?.user?.role;
      if (role !== 'admin') {
        setError('Only administrators can log in here.');
        setIsLoading(false);
        return;
      }

      // store token under the canonical key `adminToken`
      localStorage.setItem('adminToken', data.token);

      // update parent auth state if provided
      if (typeof setIsAdminAuthenticated === 'function') {
        setIsAdminAuthenticated(true);
      }

      // redirect to admin dashboard
      setCurrentPage('admin-dashboard');
    } catch (err) {
      console.error('Login error', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 cursor-pointer mb-6" onClick={() => setCurrentPage('home')}>
            <div className="p-3 rounded-full">
              <div>
  <img
    src="https://rising-sun.org/wp-content/uploads/2025/07/fotrs-logo-transparent.webp"
    alt="Caregiver with elderly client"
    className="w-[60px] h-auto object-contain block"
  />
</div>
            </div>
            <div><h1 className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500 text-2xl font-bold">New Daybreak</h1><p className="text-sm text-yellow-600">Home Support</p></div>
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
        </div>

        <div className="bg-white p-6 rounded border border-blue-300 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 bg-red-50 p-3 rounded flex items-center"><AlertCircle className="mr-2" />{error}</div>}

            <div>
              <label className="text-sm">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded pr-10" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button disabled={isLoading} className="w-full bg-yellow-600 text-white py-2 rounded">
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button onClick={() => setCurrentPage('home')} className="text-blue-600">← Back to Website</button>
          </div>
        </div>
      </div>
    </div>
  );
}
