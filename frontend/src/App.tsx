import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import InactivityWarningModal from './components/InactivityWarningModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChallengesPage from './pages/ChallengesPage';
import ProfilePage from './pages/ProfilePage';
import SpendingLimitsPage from './pages/SpendingLimitsPage';
import ChatbotPage from './pages/ChatbotPage';
import ReferralPage from './pages/ReferralPage';
import OffersPage from './pages/OffersPage';
import BankLinkingPage from './pages/BankLinkingPage';
import RechargePage from './pages/RechargePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Root component with auth guard
function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { warningActive, remainingSeconds, resetTimer } = useInactivityTimer(isAuthenticated);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
      {isAuthenticated && (
        <InactivityWarningModal
          open={warningActive}
          remainingSeconds={remainingSeconds}
          onStayLoggedIn={resetTimer}
        />
      )}
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({ component: RootComponent });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
  beforeLoad: ({ context }: any) => {
    // Auth check handled in RootComponent
  },
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const historyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/history',
  component: HistoryPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const challengesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/challenges',
  component: ChallengesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const spendingLimitsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/spending-limits',
  component: SpendingLimitsPage,
});

const chatbotRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/chatbot',
  component: ChatbotPage,
});

const referralRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/referral',
  component: ReferralPage,
});

const offersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/offers',
  component: OffersPage,
});

const bankLinkingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/bank-linking',
  component: BankLinkingPage,
});

const rechargeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/recharge',
  component: RechargePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    historyRoute,
    analyticsRoute,
    challengesRoute,
    profileRoute,
    spendingLimitsRoute,
    chatbotRoute,
    referralRoute,
    offersRoute,
    bankLinkingRoute,
    rechargeRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
