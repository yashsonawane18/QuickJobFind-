import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import JonHunterJobPortal from './components/jonhunter/JonHunterJobPortal';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { PendingApprovalPage } from './components/auth/PendingApprovalPage';
import { RejectedNoticePage } from './components/auth/RejectedNoticePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkStatusIndicator } from './components/common/NetworkStatusIndicator';
import { ExecutiveCursor } from './components/common/ExecutiveCursor';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AppScreen = 'login' | 'signup' | 'pending' | 'rejected' | 'dashboard' | 'admin';

function MainApp() {
  const { user, isAuthenticated, isAdmin, isLoading } = useUser();
  const [screen, setScreen] = useState<AppScreen>('login');
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [rejectedEmail, setRejectedEmail] = useState<string>('');

  // Synchronize screen based on authentication and URL on mount / user state change
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.status === 'approved') {
        // Check if admin route requested
        if (window.location.pathname === '/admin') {
          if (user.role === 'admin') {
            setScreen('admin');
          } else {
            toast.error('Access Denied: Administrator privileges required.');
            setScreen('dashboard');
            window.history.replaceState({}, '', '/');
          }
        } else {
          setScreen('dashboard');
        }
      } else if (user.status === 'pending') {
        setPendingEmail(user.email);
        setScreen('pending');
      } else if (user.status === 'rejected') {
        setRejectedEmail(user.email);
        setScreen('rejected');
      }
    } else {
      // Not authenticated - keep current auth screen if in signup/pending/rejected, otherwise login
      if (screen !== 'signup' && screen !== 'pending' && screen !== 'rejected') {
        setScreen('login');
      }
    }
  }, [isAuthenticated, user, isLoading]);

  // Loading Splash Screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        <span className="text-xs text-zinc-400 font-medium tracking-wide">
          Initializing QuickJob Portal...
        </span>
      </div>
    );
  }

  // Pending Approval Page
  if (screen === 'pending') {
    return (
      <PendingApprovalPage
        email={pendingEmail}
        onNavigateLogin={() => setScreen('login')}
      />
    );
  }

  // Rejected Notice Page
  if (screen === 'rejected') {
    return (
      <RejectedNoticePage
        email={rejectedEmail}
        onNavigateLogin={() => setScreen('login')}
      />
    );
  }

  // Signup Page
  if (screen === 'signup') {
    return (
      <SignupPage
        onNavigateLogin={() => setScreen('login')}
        onSignupSuccess={(email) => {
          setPendingEmail(email);
          setScreen('pending');
        }}
      />
    );
  }

  // Login Page (when not authenticated)
  if (!isAuthenticated || screen === 'login') {
    return (
      <LoginPage
        onNavigateSignup={() => setScreen('signup')}
        onStatusPending={(email) => {
          setPendingEmail(email);
          setScreen('pending');
        }}
        onStatusRejected={(email) => {
          setRejectedEmail(email);
          setScreen('rejected');
        }}
      />
    );
  }

  // Admin Dashboard (Protected server-side and client-side)
  if (screen === 'admin') {
    if (!isAdmin) {
      toast.error('Administrator access required.');
      return (
        <JonHunterJobPortal
          onNavigateAdmin={() => toast.error('Administrator access required.')}
          onNavigateSignIn={() => setScreen('login')}
        />
      );
    }
    return <AdminDashboard onBackToApp={() => setScreen('dashboard')} />;
  }

  // Main Job Portal Dashboard (Approved Users)
  return (
    <div className="size-full min-h-screen bg-[#0A0A0A] text-white selection:bg-[#8B5CF6]/30 selection:text-[#A78BFA]">
      <ExecutiveCursor />
      <ErrorBoundary fallbackTitle="QuickJob Portal Recovered">
        <JonHunterJobPortal
          onNavigateAdmin={() => {
            if (isAdmin) {
              setScreen('admin');
            } else {
              toast.error('Administrator privileges required.');
            }
          }}
          onNavigateSignIn={() => setScreen('login')}
        />
      </ErrorBoundary>
      <NetworkStatusIndicator />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
      <Toaster richColors position="top-right" />
    </UserProvider>
  );
}
