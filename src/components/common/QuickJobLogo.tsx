import React from 'react';

interface QuickJobLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const QuickJobLogo: React.FC<QuickJobLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  };

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`font-extrabold tracking-tight flex items-center leading-none ${sizeClasses[size]}`}>
        {/* "Quick" in pure white */}
        <span className="text-white">Quick</span>

        {/* "Job" in vibrant purple with soft glow */}
        <span
          className="text-[#8B5CF6] transition-all duration-300 drop-shadow-[0_0_16px_rgba(139,92,246,0.65)] ml-0.5"
          style={{
            textShadow: '0 0 18px rgba(139, 92, 246, 0.65), 0 0 32px rgba(139, 92, 246, 0.35)',
          }}
        >
          Job
        </span>

        {/* Purple Glowing Dot */}
        <span
          className={`ml-1 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] ${dotSize[size]}`}
          aria-hidden="true"
        />
      </div>

      {showTagline && (
        <span className="text-[11px] sm:text-xs text-[#A1A1AA] font-medium tracking-wide mt-1">
          Find it fast. Land it faster.
        </span>
      )}
    </div>
  );
};

export default QuickJobLogo;
