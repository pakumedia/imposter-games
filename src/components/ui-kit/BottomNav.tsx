import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  icon: ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(({ items, activeId, onSelect, className = '' }, ref) => {
  return (
    <nav 
      ref={ref}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        className
      )}
    >
      <div className="bg-game-dark rounded-pill h-14 flex items-center px-2 shadow-card gap-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'w-12 h-10 flex items-center justify-center rounded-pill transition-all duration-200 tap-scale',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-primary-foreground/50 hover:text-primary-foreground/80'
              )}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
