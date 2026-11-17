import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalMode, closeAuthModal, loginDemo, openAuthModal } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('ananya@pinterest.in');
  const [password, setPassword] = useState('••••••••••');
  const [error, setError] = useState('');

  if (!authModalMode) return null;

  const isSignup = authModalMode === 'signup';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    loginDemo(isSignup ? name : undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-[440px] bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200/80"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center text-white font-bold text-lg mb-4">
            P
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-zinc-900">
            {isSignup ? 'Create your Pinterest account' : 'Welcome back to Pinterest'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isSignup
              ? 'Save ideas, build visual boards, and share studio notes.'
              : 'Pick up right where your saved boards left off.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Rao"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>

          {error && <p className="text-xs font-medium text-[#E60023]">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {isSignup ? 'Continue' : 'Log in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex-1 h-px bg-zinc-200" />
          <span>or</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <button
          type="button"
          onClick={() => loginDemo()}
          className="w-full py-2.5 px-4 rounded-full border border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-sm font-semibold transition-colors cursor-pointer"
        >
          Continue instantly as Ananya Rao
        </button>

        <p className="text-center text-xs text-zinc-500 mt-6">
          {isSignup ? 'Already on Pinterest?' : 'New to Pinterest?'}{' '}
          <button
            type="button"
            onClick={() => openAuthModal(isSignup ? 'login' : 'signup')}
            className="font-semibold text-zinc-900 hover:underline cursor-pointer"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};
