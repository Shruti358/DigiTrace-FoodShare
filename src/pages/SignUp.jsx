import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="bg-[#FAF8F5] font-body-md text-sm text-[#1C2421] min-h-screen flex flex-col justify-between">
      <header className="w-full bg-white border-b border-[#E6E2D8] shadow-xs">
        <div className="h-16 max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-base text-[#1C2421] font-bold tracking-tight">DigiTrace</span>
              <span className="font-label-sm text-[11px] text-[#1B4D3E] font-bold uppercase tracking-wider">Food Rescue Platform</span>
            </div>
          </Link>
          <Link to="/login" className="text-xs text-[#1B4D3E] font-bold hover:underline">
            Already registered? Log In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[460px] bg-white rounded-2xl p-8 shadow-md border border-[#E6E2D8] flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1">
            <h1 className="font-headline-lg text-2xl font-extrabold text-[#1C2421]">Create DigiTrace Account</h1>
            <p className="text-xs text-[#4A5550]">Join the food rescue & zero-landfill audit network</p>
          </div>

          {submitted && (
            <div className="p-3 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Account created! Navigating to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C2421] mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Shruti Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1C2421] mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="shruti@pacificrim-dining.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1C2421] mb-1">Organization Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-bold"
              >
                <option value="donor">Food Provider / Commercial Kitchen</option>
                <option value="ngo">Non-Profit NGO / Food Bank</option>
                <option value="auditor">ESG Environmental Auditor</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1C2421] mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-bold text-xs shadow-xs mt-2">
              Complete Registration
            </button>
          </form>

          <div className="pt-4 border-t border-[#E6E2D8] text-center text-xs text-[#4A5550]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1B4D3E] font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#4A5550] border-t border-[#E6E2D8]">
        © 2026 DigiTrace Platform. All rights reserved.
      </footer>
    </div>
  );
}
