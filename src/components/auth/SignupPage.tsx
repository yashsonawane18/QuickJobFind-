import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { QuickJobLogo } from '../common/QuickJobLogo';
import { useUser } from '../../contexts/UserContext';

interface SignupPageProps {
  onNavigateLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateLogin,
  onSignupSuccess,
}) => {
  const { signup } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceYears, setExperienceYears] = useState('2-5 Yrs');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        target_role: targetRole.trim() || 'Software Engineer',
        experience_years: experienceYears,
      });

      if (res.success && res.status === 'pending') {
        onSignupSuccess(email.trim());
      } else {
        setErrorMessage(res.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Connection failed during registration.');
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
            <h1 className="text-xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Join QuickJob. All applications undergo verification before activation.
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
                Full Name <span className="text-[#8B5CF6]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address <span className="text-[#8B5CF6]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password <span className="text-[#8B5CF6]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Target Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Frontend Lead"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-[#8B5CF6] transition-all"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Experience
                </label>
                <div className="relative">
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-white text-xs focus:outline-none focus:border-[#8B5CF6] transition-all appearance-none cursor-pointer"
                  >
                    <option value="0-2 Yrs">0-2 Years</option>
                    <option value="2-5 Yrs">2-5 Years</option>
                    <option value="5-8 Yrs">5-8 Years</option>
                    <option value="8+ Yrs">8+ Years</option>
                  </select>
                  <Clock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] text-[11px] text-zinc-400">
              <span className="text-[#8B5CF6] font-semibold">Note:</span> Once submitted, your profile will be queued for administrator review before login is enabled.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:shadow-[0_0_32px_rgba(139,92,246,0.65)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#262626] text-center">
            <p className="text-xs text-[#A1A1AA]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="font-bold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
