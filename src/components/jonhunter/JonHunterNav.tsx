import React, { useState } from 'react';
import {
  Compass,
  Archive,
  Building2,
  Bookmark,
  Menu,
  X,
  Shield,
  LogOut,
  User,
} from 'lucide-react';
import { getActiveTheme } from '../../config/themeConfig';
import { QuickJobLogo } from '../common/QuickJobLogo';
import { useUser } from '../../contexts/UserContext';

export type JonHunterNavTab = 'discover' | 'career_pages' | 'recommended' | 'archive' | 'saved' | 'tracker';

export interface JonHunterNavProps {
  activeTab: JonHunterNavTab;
  onTabChange: (tab: JonHunterNavTab) => void;
  savedCount?: number;
  appliedCount?: number;
  totalDiscoveredCount?: number;
  onNavigateHome?: () => void;
  onNavigateSignIn?: () => void;
  onNavigateAdmin?: () => void;
  engineOnline?: boolean | null;
}

export const JonHunterNav: React.FC<JonHunterNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
  onNavigateAdmin,
  onNavigateSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = getActiveTheme();
  const { user, isAdmin, isAuthenticated, logout } = useUser();

  // Navigation items
  const navItems = [
    {
      id: 'discover' as JonHunterNavTab,
      label: 'Discover',
      icon: Compass,
    },
    {
      id: 'career_pages' as JonHunterNavTab,
      label: 'Career Pages',
      icon: Building2,
    },
    {
      id: 'archive' as JonHunterNavTab,
      label: '1,000+ Archive',
      icon: Archive,
    },
    {
      id: 'saved' as JonHunterNavTab,
      label: 'Saved',
      icon: Bookmark,
      count: savedCount,
    },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#262626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* QuickJob Text Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTabChange('discover')}
              className="flex items-center group cursor-pointer focus:outline-none"
            >
              <QuickJobLogo size="md" />
            </button>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[#141414] border border-[#262626] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSavedTab = item.id === 'saved';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold shadow-[0_0_16px_rgba(139,92,246,0.45)]'
                      : isSavedTab
                      ? 'text-zinc-300 hover:text-amber-300 hover:bg-white/5'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? 'text-white'
                        : isSavedTab && typeof item.count === 'number' && item.count > 0
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-400'
                    }`}
                  />
                  <span>{item.label}</span>

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Auth, Admin Console, and Live Radar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Opportunities Count */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
              </span>
              <span className="font-mono text-zinc-300 text-[11px]">9,295+ Verified Openings</span>
            </div>

            {/* Admin Console Shortcut */}
            {isAdmin && onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="px-3 py-1.5 rounded-xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/40 text-[#A78BFA] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.25)] hover:shadow-[0_0_18px_rgba(139,92,246,0.45)]"
                title="Open Admin User Approval Console"
              >
                <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Admin</span>
              </button>
            )}

            {/* User Profile / Logout */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#262626]">
                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[10px] font-bold text-[#A78BFA]">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[120px] truncate font-medium text-zinc-200">
                    {user.full_name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onNavigateSignIn}
                className="px-3.5 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#A78BFA] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_14px_rgba(139,92,246,0.4)]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40 text-xs font-bold"
              >
                Admin
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white bg-[#141414] border border-[#262626] cursor-pointer"
              aria-label="Toggle navigation tabs"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-b border-[#262626] px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSavedTab = item.id === 'saved';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] font-bold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                    : 'bg-[#0A0A0A] text-zinc-200 border-[#262626] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-inherit'
                        : isSavedTab
                        ? 'text-amber-400'
                        : 'text-[#8B5CF6]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      isActive
                        ? 'bg-black/20 text-inherit'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {isAuthenticated && user && (
            <div className="pt-2 border-t border-[#262626] flex items-center justify-between px-2 text-xs">
              <span className="text-zinc-400 truncate">{user.email}</span>
              <button
                type="button"
                onClick={logout}
                className="text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default JonHunterNav;
