import React from 'react';
import { Clock, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { QuickJobLogo } from '../common/QuickJobLogo';
import { useUser } from '../../contexts/UserContext';

interface PendingApprovalPageProps {
  email?: string;
  onNavigateLogin: () => void;
}

export const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({
  email,
  onNavigateLogin,
}) => {
  const { refreshUser } = useUser();
  const [checking, setChecking] = React.useState(false);

  const handleCheckAgain = async () => {
    setChecking(true);
    await refreshUser();
    setTimeout(() => {
      setChecking(false);
      onNavigateLogin();
    }, 700);
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
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 mx-auto flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(139,92,246,0.3)]">
            <Clock className="w-8 h-8 text-[#8B5CF6] animate-pulse" />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight mb-2">
            Your account is waiting for admin approval.
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
            We manually review each applicant to maintain the highest quality network of verified candidates and direct tech opportunities.
            {email && (
              <span className="block mt-2 font-mono text-xs text-purple-300">
                Registered email: {email}
              </span>
            )}
          </p>

          <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-left text-xs text-zinc-300 space-y-2 mb-6">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span>What happens next?</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-normal">
              An administrator will verify your profile details. Once approved, you will have immediate access to job discovery, direct corporate ATS positions, and 1-click AutoScript generation.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCheckAgain}
              disabled={checking}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:shadow-[0_0_32px_rgba(139,92,246,0.65)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking Status...' : 'Check Approval Status'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0A] hover:bg-white/5 border border-[#262626] text-zinc-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
