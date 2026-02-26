import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
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
import LoginPage from './pages/LoginPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Layout />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const challengesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/challenges',
  component: ChallengesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const limitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/limits',
  component: SpendingLimitsPage,
});

const chatbotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chatbot',
  component: ChatbotPage,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: ReferralPage,
});

const offersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/offers',
  component: OffersPage,
});

const bankLinkingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bank-linking',
  component: BankLinkingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  historyRoute,
  analyticsRoute,
  challengesRoute,
  profileRoute,
  limitsRoute,
  chatbotRoute,
  referralRoute,
  offersRoute,
  bankLinkingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
