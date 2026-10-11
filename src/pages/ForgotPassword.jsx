import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
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
            Back to Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[440px] bg-white rounded-2xl p-8 shadow-md border border-[#E6E2D8] flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1">
            <h1 className="font-headline-lg text-2xl font-extrabold text-[#1C2421]">Reset Password</h1>
            <p className="text-xs text-[#4A5550]">Enter your registered email to receive password reset link</p>
          </div>

          {sent ? (
            <div className="p-4 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex flex-col gap-2 text-center border border-[#A7F3D0]">
              <span className="material-symbols-outlined text-[28px] mx-auto">mark_email_read</span>
              <span>Reset link dispatched to {email}! Check your inbox.</span>
              <Link to="/login" className="mt-2 inline-block px-4 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
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

              <button type="submit" className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-bold text-xs shadow-xs mt-2">
                Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#E6E2D8] text-center text-xs text-[#4A5550]">
            Remembered your password?{' '}
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
