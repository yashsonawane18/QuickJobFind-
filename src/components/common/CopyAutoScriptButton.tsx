import React, { useState } from 'react';
import { Code2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { generateAutoScript, AutoScriptJobData } from '../../lib/autoScriptGenerator';

interface CopyAutoScriptButtonProps {
  job: {
    job_title?: string;
    jobTitle?: string;
    title?: string;
    company?: string;
    location?: string;
    job_type?: string;
    salary?: string;
    experience_required?: string;
    experience?: string;
    key_skills?: string[] | string;
    application_url?: string;
    career_url?: string;
    job_description?: string;
    description?: string;
  };
  variant?: 'card' | 'modal' | 'pill';
  className?: string;
}

export const CopyAutoScriptButton: React.FC<CopyAutoScriptButtonProps> = ({
  job,
  variant = 'card',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const data: AutoScriptJobData = {
      jobTitle: job.job_title || job.jobTitle || job.title || '',
      company: job.company || '',
      location: job.location || '',
      jobType: job.job_type || 'Full-time',
      salary: job.salary || '',
      experienceRequired: job.experience_required || job.experience || '',
      keySkills: job.key_skills || [],
      applicationUrl: job.application_url || '',
      careerPageUrl: job.career_url || job.application_url || '',
      jobDescription: job.job_description || job.description || '',
    };

    const script = generateAutoScript(data);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(script);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = script;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast.success('AutoScript copied. Paste it in the tracker console.', {
        description: `Ready for "${data.jobTitle}" at ${data.company}`,
        duration: 4000,
      });

      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error('Failed to copy script to clipboard');
    }
  };

  if (variant === 'modal') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`px-4 py-3 rounded-xl bg-[#1C1929] hover:bg-[#2E284A] border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-purple-200 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_14px_rgba(139,92,246,0.25)] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] active:scale-95 ${className}`}
        title="Generate JavaScript snippet to autofill this job into tracker console"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">AutoScript Copied!</span>
          </>
        ) : (
          <>
            <Code2 className="w-4 h-4 text-[#8B5CF6]" />
            <span>Copy AutoScript</span>
          </>
        )}
      </button>
    );
  }

  // Card Variant
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`px-3 py-2.5 rounded-xl bg-[#161224] hover:bg-[#251E3D] text-purple-200 hover:text-white border border-[#8B5CF6]/35 hover:border-[#8B5CF6] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.45)] active:scale-95 ${className}`}
      title="Copy JavaScript snippet to fill tracker console"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 text-[11px]">Copied</span>
        </>
      ) : (
        <>
          <Code2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="text-[11px]">AutoScript</span>
        </>
      )}
    </button>
  );
};
