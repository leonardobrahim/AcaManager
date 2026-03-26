import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <TopBar />
      <main className="flex-1 pb-20 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-6 sm:pt-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}