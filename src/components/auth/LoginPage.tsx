import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { QuickJobLogo } from '../common/QuickJobLogo';
import { useUser } from '../../contexts/UserContext';

interface LoginPageProps {
  onNavigateSignup: () => void;
  onStatusPending?: (email: string) => void;
  onStatusRejected?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateSignup,
  onStatusPending,
  onStatusRejected,
}) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password);

      if (res.success) {
        // Logged in successfully
        return;
      }

      if (res.status === 'pending') {
        if (onStatusPending) {
          onStatusPending(email);
        } else {
          setErrorMessage('Your account is waiting for admin approval.');
        }
        return;
      }

      if (res.status === 'rejected') {
        if (onStatusRejected) {
          onStatusRejected(email);
        } else {
          setErrorMessage('Your request was not approved');
        }
        return;
      }

      setErrorMessage(res.message || 'Invalid email or password.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <QuickJobLogo size="lg" />
          </div>
          <p className="text-sm text-[#A1A1AA] font-medium tracking-wide">
            Find it fast. Land it faster.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-[#8B5CF6]/30">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">Sign In</h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Enter your credentials to access your verified career dashboard.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:shadow-[0_0_32px_rgba(139,92,246,0.65)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="mt-5 p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] text-[11px] text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-300 block">Default Admin Access:</span>
            <div className="flex items-center justify-between text-zinc-400">
              <span>admin@quickjob.io</span>
              <span className="font-mono text-zinc-500">QuickJobAdmin2025!</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#262626] text-center">
            <p className="text-xs text-[#A1A1AA]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateSignup}
                className="font-bold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
