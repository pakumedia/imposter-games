import { Play, Users } from 'lucide-react';
import { GameCard, CardColor } from './GameCard';
import { PillButton } from './PillButton';
import { Sparkles } from './Sparkles';
import { cn } from '@/lib/utils';

interface HeroGameCardProps {
  title: string;
  subtitle?: string;
  onlineCount?: number;
  color: CardColor;
  mascot?: React.ReactNode;
  onPlay?: () => void;
  className?: string;
}

export function HeroGameCard({
  title,
  subtitle,
  onlineCount,
  color,
  mascot,
  onPlay,
  className = ''
}: HeroGameCardProps) {
  return (
    <GameCard color={color} className={cn('relative h-[420px] flex flex-col', className)}>
      {/* Title bubble */}
      <div className="p-5">
        <div className="inline-block bg-card/95 backdrop-blur-sm rounded-card px-5 py-3 shadow-soft">
          <h2 className="text-h2 text-foreground leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-caption text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Online count */}
      {onlineCount !== undefined && (
        <div className="px-5 mt-1">
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-pill px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-game-green animate-pulse-soft" />
            <span className="text-caption text-foreground font-semibold">{onlineCount} online</span>
          </div>
        </div>
      )}
      
      {/* Mascot area */}
      <div className="flex-1 relative flex items-end justify-center pb-24 pt-4">
        <Sparkles className="absolute inset-0" />
        {mascot && (
          <div className="relative z-10 animate-float">
            {mascot}
          </div>
        )}
      </div>
      
      {/* Play button */}
      <div className="absolute bottom-5 left-5 right-5">
        <PillButton
          variant="dark"
          fullWidth
          icon={<Play className="w-5 h-5 fill-current" />}
          onClick={onPlay}
        >
          Play Game
        </PillButton>
      </div>
    </GameCard>
  );
}
