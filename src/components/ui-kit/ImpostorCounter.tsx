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
    <div className={cn("flex items-center justify-center gap-6", className)}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all tap-scale",
          "bg-muted/60 text-muted-foreground",
          value <= min 
            ? "opacity-40 cursor-not-allowed" 
            : "hover:bg-muted active:scale-95"
        )}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>
      
      <div className="flex flex-col items-center min-w-[40px]">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
      </div>
      
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all tap-scale",
          "bg-muted/60 text-muted-foreground",
          value >= max 
            ? "opacity-40 cursor-not-allowed" 
            : "hover:bg-muted active:scale-95"
        )}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
