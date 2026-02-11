import { BookOpen, StickyNote, BookMarked, CalendarCheck, Brain } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Brain, label: 'Decisions' },
  { to: '/diary', icon: BookOpen, label: 'Diary' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/books', icon: BookMarked, label: 'Books' },
  { to: '/planner', icon: CalendarCheck, label: 'Planner' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="container max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_6px_hsl(38_92%_60%/0.5)]')} />
                <span className="font-medium">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
