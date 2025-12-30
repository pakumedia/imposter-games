import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpostorCounterProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ImpostorCounter({ 
  value, 
  min = 1, 
  max, 
  onChange,
  className 
}: ImpostorCounterProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
          value <= min 
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-game-orange text-white hover:bg-game-orange/80"
        )}
      >
        <Minus className="w-5 h-5" />
      </button>
      
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-h1 text-foreground font-bold">{value}</span>
        <span className="text-caption text-muted-foreground">
          of {max} max
        </span>
      </div>
      
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
          value >= max 
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-game-teal text-white hover:bg-game-teal/80"
        )}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
