import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
// GameCard component with forwardRef support

export type CardColor = 'yellow' | 'orange' | 'blue' | 'purple' | 'pink' | 'teal' | 'dark' | 'white' | 'subtle';

interface GameCardProps {
  children: ReactNode;
  color?: CardColor;
  className?: string;
  onClick?: () => void;
}

const colorClasses: Record<CardColor, string> = {
  yellow: 'game-card-yellow',
  orange: 'game-card-orange',
  blue: 'game-card-blue',
  purple: 'game-card-purple',
  pink: 'game-card-pink',
  teal: 'game-card-teal',
  dark: 'game-card-dark text-primary-foreground',
  white: 'bg-card',
  subtle: 'bg-card-subtle shadow-embedded border border-border/30',
};

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(({ 
  children, 
  color = 'white',
  className = '',
  onClick
}, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'rounded-card shadow-card overflow-hidden',
        colorClasses[color],
        onClick && 'cursor-pointer tap-scale',
        className
      )}
    >
      {children}
    </div>
  );
});

GameCard.displayName = 'GameCard';
