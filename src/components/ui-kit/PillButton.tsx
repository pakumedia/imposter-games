import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PillButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'success' | 'danger' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'h-10 px-4 text-caption',
  md: 'h-12 px-5 text-body-sm',
  lg: 'h-14 px-6 text-body',
};

const variantClasses = {
  primary: 'bg-primary text-primary-foreground shadow-button hover:bg-game-teal-dark',
  secondary: 'bg-secondary text-secondary-foreground shadow-soft hover:bg-muted',
  dark: 'bg-game-dark text-primary-foreground shadow-button hover:bg-foreground',
  outline: 'bg-transparent border-2 border-secondary text-foreground hover:bg-secondary',
  ghost: 'bg-transparent text-foreground hover:bg-secondary',
  success: 'bg-game-green text-primary-foreground shadow-button hover:opacity-90',
  danger: 'bg-destructive text-destructive-foreground shadow-button hover:opacity-90',
  orange: 'bg-game-orange text-primary-foreground shadow-button hover:bg-game-orange-dark',
};

export function PillButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  className = '',
  disabled = false
}: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-pill font-bold flex items-center justify-center gap-2 transition-all duration-150 tap-scale',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
