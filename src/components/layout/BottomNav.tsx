import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Calendar, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function BottomNav() {
  const links = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/schedule', icon: Clock, label: 'Agenda' },
    { to: '/subjects', icon: BookOpen, label: 'Disciplinas' },
    { to: '/tasks', icon: Calendar, label: 'Tarefas' },
    { to: '/study', icon: CheckSquare, label: 'Estudar' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md pb-safe sm:hidden transition-colors duration-200">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 dark:text-slate-400 transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-200',
              isActive && 'text-indigo-600 dark:text-indigo-400 font-medium'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className="text-[10px]">{label}</span>
              {isActive && (
                <span className="absolute top-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}