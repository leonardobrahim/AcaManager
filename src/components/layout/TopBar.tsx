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
    <header className="sticky top-0 z-50 hidden h-16 w-full items-center border-b border-slate-200 bg-white px-6 sm:flex">
      <div className="flex items-center gap-2 font-semibold text-slate-900 mr-8">
        <GraduationCap className="h-6 w-6 text-indigo-600" />
        <span>AcaManager</span>
      </div>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900',
                isActive && 'text-slate-900'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
