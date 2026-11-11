import React from 'react';

/**
 * QuickJob Unified Brand & Theme System
 * Primary: #0A0A0A (Black)
 * Cards / Surfaces: #141414, Border #262626
 * Text: #FFFFFF, Secondary Text #A1A1AA
 * Accent: #8B5CF6 (Purple), Hover: #A78BFA
 * Glow: box-shadow: 0 0 24px rgba(139, 92, 246, 0.45)
 */

export interface QuickJobTheme {
  name: string;
  tagline: string;
  colors: {
    bg: string;
    card: string;
    cardBorder: string;
    cardHoverBorder: string;
    textPrimary: string;
    textSecondary: string;
    purple: string;
    purpleHover: string;
    purpleLight: string;
    purpleGlow: string;
  };
  classes: {
    wrapper: string;
    nav: string;
    card: string;
    cardBorder: string;
    innerBox: string;
    innerBoxBorder: string;
    btnPrimary: string;
    btnSecondary: string;
    badgePurple: string;
  };
}

export const QUICKJOB_THEME: QuickJobTheme = {
  name: 'QuickJob',
  tagline: 'Find it fast. Land it faster.',
  colors: {
    bg: '#0A0A0A',
    card: '#141414',
    cardBorder: '#262626',
    cardHoverBorder: '#8B5CF6',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    purple: '#8B5CF6',
    purpleHover: '#A78BFA',
    purpleLight: 'rgba(139, 92, 246, 0.15)',
    purpleGlow: '0 0 24px rgba(139, 92, 246, 0.45)',
  },
  classes: {
    wrapper: 'bg-[#0A0A0A] text-white selection:bg-[#8B5CF6]/30 selection:text-white',
    nav: 'bg-[#0A0A0A]/95 backdrop-blur-xl border-[#262626]',
    card: 'bg-[#141414] text-white border border-[#262626] rounded-2xl shadow-xl transition-all duration-200 hover:border-[#8B5CF6]/60 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]',
    cardBorder: 'border-[#262626]',
    innerBox: 'bg-[#18181B] text-zinc-100',
    innerBoxBorder: 'border-[#27272A]',
    btnPrimary: 'btn-quickjob-primary',
    btnSecondary: 'px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] hover:border-zinc-500 text-xs font-semibold transition-all cursor-pointer',
    badgePurple: 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 font-semibold px-2.5 py-0.5 rounded-full text-xs',
  },
};

export const getActiveTheme = () => {
  return {
    wrapperClass: QUICKJOB_THEME.classes.wrapper,
    wrapperStyle: {
      backgroundColor: '#0A0A0A',
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139, 92, 246, 0.18) 0%, rgba(10, 10, 10, 0.95) 55%, #0A0A0A 100%),
        radial-gradient(circle at 10% 40%, rgba(139, 92, 246, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 90% 70%, rgba(167, 139, 250, 0.03) 0%, transparent 40%)
      `,
      backgroundAttachment: 'fixed',
    },
    navClass: QUICKJOB_THEME.classes.nav,
    cardClass: 'bg-[#141414] text-white shadow-xl',
    cardHoverClass: 'hover:bg-[#18181B] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_24px_rgba(139,92,246,0.30)]',
    cardBorderClass: 'border-[#262626]',
    innerBoxClass: 'bg-[#18181B] text-zinc-100',
    innerBoxBorderClass: 'border-[#27272A]',
    pillActiveClass: 'bg-[#8B5CF6] text-white font-extrabold shadow-[0_0_20px_rgba(139,92,246,0.45)]',
    pillInactiveClass: 'text-zinc-400 hover:text-white hover:bg-white/5',
    accentGreen: '#8B5CF6',
    accentGlowSvg: true,
  };
};

export default QUICKJOB_THEME;
