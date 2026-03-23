import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <TopBar />
      <main className="flex-1 pb-20 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
