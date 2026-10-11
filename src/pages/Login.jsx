import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiState, setUiState] = useState('default'); // default, error, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setUiState('loading');
    setTimeout(() => {
      setUiState('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    }, 500);
  };

  return (
    <div className="bg-[#FAF8F5] font-body-md text-sm text-[#1C2421] min-h-screen flex flex-col justify-between selection:bg-[#1B4D3E] selection:text-white">
      {/* Top Bar */}
      <header className="w-full bg-white border-b border-[#E6E2D8] shadow-xs">
        <div className="h-16 max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-base text-[#1C2421] font-bold tracking-tight">DigiTrace</span>
              <span className="font-label-sm text-[11px] text-[#1B4D3E] font-bold uppercase tracking-wider">Food Rescue & Waste Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-[#4A5550] hover:text-[#1C2421] font-bold transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="flex flex-col w-full items-center justify-center max-w-[440px]">
          
          <div className="w-full bg-white rounded-2xl p-8 shadow-md border border-[#E6E2D8] flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1">
              <h1 className="font-headline-lg text-2xl font-extrabold text-[#1C2421]">Log in to DigiTrace</h1>
              <p className="text-xs text-[#4A5550]">Access your food rescue marketplace & audit dashboard</p>
            </div>

            {uiState === 'error' && (
              <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>Invalid credentials. Please verify your email and password.</span>
              </div>
            )}

            {uiState === 'success' && (
              <div className="p-3 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Authenticated! Redirecting to Dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="shruti@pacificrim-dining.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#1C2421]">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#0284C7] hover:underline font-bold">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                />
              </div>

              <button
                type="submit"
                disabled={uiState === 'loading'}
                className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-bold text-xs shadow-xs transition-colors mt-2"
              >
                {uiState === 'loading' ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E6E2D8] text-center text-xs text-[#4A5550]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#1B4D3E] font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#4A5550] border-t border-[#E6E2D8]">
        © 2026 DigiTrace Platform. All rights reserved.
      </footer>
    </div>
  );
}
