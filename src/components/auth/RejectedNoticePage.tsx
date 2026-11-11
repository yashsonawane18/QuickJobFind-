import React from 'react';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import { QuickJobLogo } from '../common/QuickJobLogo';

interface RejectedNoticePageProps {
  email?: string;
  onNavigateLogin: () => void;
}

export const RejectedNoticePage: React.FC<RejectedNoticePageProps> = ({
  email,
  onNavigateLogin,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none" />

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
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(244,63,94,0.2)]">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight mb-2">
            Your request was not approved
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
            We are unable to approve your application for platform access at this time.
            {email && (
              <span className="block mt-2 font-mono text-xs text-rose-300">
                Account email: {email}
              </span>
            )}
          </p>

          <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-left text-xs text-zinc-300 space-y-2 mb-6">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Questions or Appeals?</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-normal">
              If you updated your professional credentials or believe this decision was reached in error, please reach out to our team at{' '}
              <a href="mailto:support@quickjob.io" className="text-[#8B5CF6] hover:underline font-semibold">
                support@quickjob.io
              </a>.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0A] hover:bg-white/5 border border-[#262626] text-zinc-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
