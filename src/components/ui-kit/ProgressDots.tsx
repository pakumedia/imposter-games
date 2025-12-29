import { cn } from '@/lib/utils';

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function ProgressDots({ total, current, className = '' }: ProgressDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current 
              ? 'w-6 h-2 bg-foreground' 
              : 'w-2 h-2 bg-foreground/20'
          )}
        />
      ))}
    </div>
  );
}
