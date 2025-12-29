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
  backgroundImage?: string;
  backgroundVideo?: string;
  buttonVariant?: 'primary' | 'secondary' | 'dark' | 'orange' | 'skyblue';
  onPlay?: () => void;
  className?: string;
  comingSoon?: boolean;
}

export function HeroGameCard({
  title,
  subtitle,
  onlineCount,
  color,
  mascot,
  backgroundImage,
  backgroundVideo,
  buttonVariant = 'dark',
  onPlay,
  className = '',
  comingSoon = false
}: HeroGameCardProps) {
  const hasBackground = backgroundImage || backgroundVideo;
  
  return (
    <GameCard color={color} className={cn('relative h-[525px] sm:h-[578px] md:h-[651px] flex flex-col overflow-hidden', className)}>
      {/* Coming soon overlay */}
      {comingSoon && (
        <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-card/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-border/50">
            <span className="text-lg font-semibold text-muted-foreground">Coming Soon</span>
          </div>
        </div>
      )}
      {/* Background video */}
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Background image (fallback if no video) */}
      {backgroundImage && !backgroundVideo && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Title bubble */}
        <div className="p-5">
          <div className="inline-block bg-card/95 backdrop-blur-sm rounded-card px-5 py-3 shadow-soft">
            <h2 className="text-h2 text-foreground leading-tight">{title}</h2>
            {subtitle && (
              <p className="text-caption text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        
        {/* Mascot area - only show if no background */}
        {!hasBackground && (
          <div className="flex-1 relative flex items-end justify-center pb-24 pt-4">
            <Sparkles className="absolute inset-0" />
            {mascot && (
              <div className="relative z-10 animate-float">
                {mascot}
              </div>
            )}
          </div>
        )}
        
        {/* Spacer when background is used */}
        {hasBackground && <div className="flex-1" />}
        
        {/* Play button */}
        <div className="absolute bottom-5 left-5 right-5">
          <PillButton
            variant={buttonVariant}
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={onPlay}
          >
            Play Game
          </PillButton>
        </div>
      </div>
    </GameCard>
  );
}
