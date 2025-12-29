import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ListRowPillProps {
  avatar?: ReactNode;
  avatarColor?: string;
  name: string;
  subtitle?: string;
  rightContent?: ReactNode;
  rank?: number;
  style?: CSSProperties;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListRowPill({
  avatar,
  avatarColor = 'bg-game-purple',
  name,
  subtitle,
  rightContent,
  rank,
  isHighlighted = false,
  onClick,
  className = '',
  style
}: ListRowPillProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'h-14 rounded-pill flex items-center gap-3 px-3 transition-all duration-150',
        isHighlighted 
          ? 'bg-primary text-primary-foreground shadow-button' 
          : 'bg-card shadow-soft',
        onClick && 'cursor-pointer tap-scale',
        className
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden',
        !avatar && avatarColor
      )}>
        {avatar || (
          <span className={cn(
            'font-bold text-body',
            isHighlighted ? 'text-primary' : 'text-primary-foreground'
          )}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* Name & subtitle */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-bold text-body-sm truncate',
          isHighlighted ? 'text-primary-foreground' : 'text-foreground'
        )}>
          {name}
        </p>
        {subtitle && (
          <p className={cn(
            'text-caption-sm truncate',
            isHighlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Right content or rank */}
      {rightContent || (rank !== undefined && (
        <div className={cn(
          'font-bold text-h3',
          isHighlighted ? 'text-primary-foreground' : 'text-foreground'
        )}>
          #{rank}
        </div>
      ))}
    </div>
  );
}
