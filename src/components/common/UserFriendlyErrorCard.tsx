import React from 'react';
import { WifiOff, AlertCircle, RefreshCw, XCircle, Bookmark, Sparkles } from 'lucide-react';

export interface UserFriendlyErrorCardProps {
  title?: string;
  message?: string;
  query?: string;
  location?: string;
  isNetwork?: boolean;
  onRetry: () => void;
  onClearFilters?: () => void;
  onViewSaved?: () => void;
  isRetrying?: boolean;
}

export const UserFriendlyErrorCard: React.FC<UserFriendlyErrorCardProps> = ({
  title = 'Temporarily Unable to Reach Live Job Feeds',
  message = 'We could not reach the live job network right now. Please check your internet connection or try again in a few moments.',
  query,
  location,
  isNetwork = true,
  onRetry,
  onClearFilters,
  onViewSaved,
  isRetrying = false,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#101218]/95 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
        {/* Soft Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
          {isNetwork ? <WifiOff className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {isNetwork ? 'Network Notice' : 'Service Notice'}
            </span>
          </div>

          {/* Searched Query reminder */}
          {query && (
            <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-1">
              Active search: <span className="text-[#00C896] font-semibold">"{query}"</span>
              {location && location !== 'All India (Remote & Nationwide)' && (
                <span className="text-zinc-400"> in {location}</span>
              )}
            </p>
          )}

          {/* Reassuring Explanation */}
          <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed max-w-2xl">
            {message}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="px-5 py-2.5 rounded-xl bg-[#00C896] hover:bg-[#00E5AA] text-[#0A0A0A] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying Connection...' : 'Try Again'}</span>
            </button>

            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Show All Openings</span>
              </button>
            )}

            {onViewSaved && (
              <button
                type="button"
                onClick={onViewSaved}
                className="px-4 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 border border-zinc-800 text-xs font-medium transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#00C896]" />
                <span>View Saved Jobs</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFriendlyErrorCard;
