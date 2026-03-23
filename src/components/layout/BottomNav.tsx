import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function BottomNav() {
  const links = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/subjects', icon: BookOpen, label: 'Disciplinas' },
    { to: '/tasks', icon: Calendar, label: 'Tarefas' },
    { to: '/study', icon: CheckSquare, label: 'Estudar' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white pb-safe sm:hidden">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 transition-colors',
              isActive && 'text-slate-900 font-medium'
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
