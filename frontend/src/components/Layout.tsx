import { Outlet } from '@tanstack/react-router';
import BottomNavigation from './BottomNavigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/finmate-logo.dim_256x256.png"
              alt="FinMate"
              className="w-10 h-10"
            />
            <h1 className="text-xl font-bold text-white">FinMate</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}
