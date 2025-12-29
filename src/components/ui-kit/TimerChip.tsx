import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerChipProps {
  seconds: number;
  isWarning?: boolean;
  className?: string;
}

export function TimerChip({ seconds, isWarning = false, className = '' }: TimerChipProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-bold text-caption',
      isWarning 
        ? 'bg-destructive text-destructive-foreground animate-pulse-soft' 
        : 'bg-card shadow-soft text-foreground',
      className
    )}>
      <Clock className="w-4 h-4" />
      <span>
        {minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${secs}s`}
      </span>
    </div>
  );
}
