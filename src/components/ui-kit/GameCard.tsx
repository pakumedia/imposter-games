import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardColor = 'yellow' | 'orange' | 'blue' | 'purple' | 'pink' | 'teal' | 'dark' | 'white';

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
};

export function GameCard({ 
  children, 
  color = 'white',
  className = '',
  onClick
}: GameCardProps) {
  return (
    <div
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
}
