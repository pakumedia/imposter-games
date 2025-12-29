import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  icon: ReactNode;
  label: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function BottomNav({ items, activeId, onSelect, className = '' }: BottomNavProps) {
  return (
    <nav className={cn(
      'fixed bottom-5 left-5 right-5 z-50',
      className
    )}>
      <div className="bg-game-dark rounded-pill h-16 flex items-center justify-around px-2 shadow-card">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-pill transition-all duration-200 tap-scale min-w-[60px]',
                isActive 
                  ? 'bg-primary/20' 
                  : 'hover:bg-primary-foreground/10'
              )}
            >
              <span className={cn(
                'transition-colors duration-200',
                isActive ? 'text-primary-foreground' : 'text-primary-foreground/60'
              )}>
                {item.icon}
              </span>
              {isActive && (
                <span className="text-caption-sm text-primary-foreground font-semibold animate-fade-in">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
