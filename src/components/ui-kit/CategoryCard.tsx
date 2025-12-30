import { Lock, Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  isSelected: boolean;
  isPro?: boolean;
  isCustom?: boolean;
  onToggle: () => void;
  className?: string;
}

export function CategoryCard({ 
  name, 
  isSelected, 
  isPro = false,
  isCustom = false,
  onToggle,
  className 
}: CategoryCardProps) {
  const isLocked = isPro;

  return (
    <button
      onClick={!isLocked ? onToggle : undefined}
      disabled={isLocked}
      className={cn(
        "relative p-4 rounded-2xl border-2 transition-all text-left",
        isLocked 
          ? "bg-muted/50 border-muted cursor-not-allowed opacity-60"
          : isSelected
            ? "bg-game-teal/10 border-game-teal"
            : "bg-card border-border hover:border-muted-foreground/50 tap-scale",
        className
      )}
    >
      {/* PRO Badge */}
      {isPro && (
        <div className="absolute -top-2 -right-2 bg-game-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" />
          PRO
        </div>
      )}
      
      {/* Custom badge for Custom Category */}
      {isCustom && (
        <div className="absolute -top-2 left-2 bg-game-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          PREMIUM
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={cn(
          "font-semibold text-body",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {name}
        </span>
        
        {isLocked ? (
          <Lock className="w-4 h-4 text-muted-foreground" />
        ) : isSelected ? (
          <div className="w-5 h-5 rounded-full bg-game-teal flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>
    </button>
  );
}
