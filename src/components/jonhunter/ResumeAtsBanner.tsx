import React, { useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  X,
  Target,
  Sparkles,
} from 'lucide-react';
import { CandidateParsedProfile } from '../../lib/applicationApi';
import { toast } from 'sonner';
import { errorLogger } from '../../lib/errors/errorLogger';

export interface ResumeAtsBannerProps {
  resumeProfile: CandidateParsedProfile | null;
  resumeFileName: string;
  isParsing: boolean;
  onFileUpload: (file: File) => void;
  onClearResume: () => void;
}

export const ResumeAtsBanner: React.FC<ResumeAtsBannerProps> = ({
  resumeProfile,
  resumeFileName,
  isParsing,
  onFileUpload,
  onClearResume,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so user can re-upload same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // 1. Check file size (max 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('File exceeds 10MB limit. Please upload a smaller resume.');
      errorLogger.warn('ResumeAtsBanner', `File too large: ${file.name} (${file.size} bytes)`);
      return;
    }

    // 2. Check 0-byte file
    if (file.size === 0) {
      toast.error('The selected file appears to be empty. Please choose a valid resume.');
      return;
    }

    // 3. Check allowed extensions
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    if (!hasValidExt) {
      toast.error('Unsupported file format. Please upload a PDF, DOCX, or TXT document.');
      errorLogger.warn('ResumeAtsBanner', `Unsupported extension: ${file.name}`);
      return;
    }

    onFileUpload(file);
  };

  return (
    <div className="bg-[#141414] border border-[#262626] hover:border-[#8B5CF6]/30 rounded-2xl p-5 sm:p-6 shadow-2xl text-white transition-all">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Value Proposition */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 flex items-center justify-center text-[#8B5CF6] shrink-0 shadow-[0_0_16px_rgba(139,92,246,0.25)]">
            <Target className="w-6 h-6 text-[#A78BFA]" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/15 px-2.5 py-0.5 rounded-md border border-[#8B5CF6]/30">
                QuickJob ATS Scoring Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Instant Profile Match
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {resumeProfile
                ? `Matched for ${resumeProfile.name || 'Candidate'} (${resumeProfile.total_experience_years || 0} Yrs Experience)`
                : 'Upload Your Resume to Unlock 70–100% Match Scores'}
            </h3>

            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl mt-1 leading-relaxed">
              {resumeProfile ? (
                <span>
                  Showing real-time match rankings based on your core skills:{' '}
                  <strong className="text-white">
                    {(resumeProfile.top_skills || []).slice(0, 4).join(', ') || 'General Engineering'}
                  </strong>.
                </span>
              ) : (
                'Our deterministic zero-LLM parser indexes your top competencies in under 100ms and ranks all openings by strict keyword and domain compatibility.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Upload Button or Active File Badge */}
        <div className="shrink-0 flex items-center gap-3">
          {resumeProfile ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="font-semibold text-white truncate max-w-[160px]" title={resumeFileName}>
                {resumeFileName || 'Resume Attached'}
              </span>
              <button
                type="button"
                onClick={onClearResume}
                className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                title="Remove resume"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isParsing}
              onClick={() => fileInputRef.current?.click()}
              className="btn-quickjob-primary px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-75 active:scale-[0.98]"
            >
              {isParsing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-bold text-white">Scanning Profile...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-white stroke-[2.5]" />
                  <span className="font-bold text-white">Upload Resume (PDF / DOCX)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAtsBanner;
