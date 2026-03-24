import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Calendar, GraduationCap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function TopBar() {
  const links = [
    { to: '/', icon: Home, label: 'Painel' },
    { to: '/subjects', icon: BookOpen, label: 'Disciplinas' },
    { to: '/tasks', icon: Calendar, label: 'Tarefas e Provas' },
    { to: '/study', icon: CheckSquare, label: 'Tópicos de Estudo' },
  ];

  return (
    <header className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-6 sm:flex">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-lg tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span>AcaManager</span>
        </div>
        <nav className="flex items-center space-x-1 text-sm font-medium">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-50',
                  isActive && 'bg-slate-100/80 text-indigo-600 hover:bg-slate-100/80 hover:text-indigo-600'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
    </header>
  );
}
