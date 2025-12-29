import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const variantClasses = {
  default: 'bg-card text-foreground shadow-soft hover:bg-secondary',
  ghost: 'bg-transparent text-foreground hover:bg-secondary',
  teal: 'bg-primary text-primary-foreground shadow-button hover:bg-game-teal-dark',
};

export function IconButton({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-150 tap-scale',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {children}
    </button>
  );
}
