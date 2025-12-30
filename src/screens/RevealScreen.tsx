import { useState, useEffect } from 'react';
import { AppShell, GameCard, PillButton, Sparkles } from '@/components/ui-kit';
import { Mascot, ImpostorMascot } from '@/components/mascots';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { cn } from '@/lib/utils';

interface RevealScreenProps {
  onDone: () => void;
}

export function RevealScreen({ onDone }: RevealScreenProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState<number | null>(null);
  const { players, currentPlayerIndex, secretWord, secretHint, category, impostorIds, settings } = useGameStore();
  
  const currentPlayer = players[currentPlayerIndex];
  const isImpostor = impostorIds.includes(currentPlayer.id);

  useEffect(() => {
    if (isRevealed) {
      // Auto-hide after 6 seconds
      const timer = window.setTimeout(() => {
        setIsRevealed(false);
        setAutoHideTimer(null);
      }, 6000);
      
      // Countdown
      let countdown = 6;
      const countdownInterval = window.setInterval(() => {
        countdown--;
        setAutoHideTimer(countdown);
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isRevealed]);

  const handleTapToReveal = () => {
    setIsRevealed(true);
    setAutoHideTimer(6);
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
        <div className="w-full max-w-sm">
          {/* Player name */}
          <div className="text-center mb-6">
            <span className="text-caption text-muted-foreground uppercase tracking-wide">
              {currentPlayer.name}'s Card
            </span>
          </div>

          {/* The card */}
          <GameCard 
            color={isRevealed ? (isImpostor ? 'dark' : 'teal') : 'white'}
            className={cn(
              'min-h-[380px] flex flex-col items-center justify-center p-8 relative overflow-hidden transition-all duration-500',
              !isRevealed && 'cursor-pointer tap-scale'
            )}
            onClick={!isRevealed ? handleTapToReveal : undefined}
          >
            {!isRevealed ? (
              /* Hidden state */
              <div className="text-center animate-pulse-soft">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-h2 text-foreground mb-2">Tap to Reveal</h2>
                <p className="text-body text-muted-foreground">
                  Make sure only you can see!
                </p>
              </div>
            ) : (
              /* Revealed state */
              <div className="text-center animate-scale-in">
                <Sparkles count={8} className="absolute inset-0" />
                
                {isImpostor ? (
                  <>
                    <ImpostorMascot size="lg" className="mx-auto mb-4" />
                    <h2 className="text-h1 text-destructive mb-2 animate-pulse-soft">
                      IMPOSTOR
                    </h2>
                    
                    {/* Show category to impostor if enabled */}
                    {settings.showCategoryToImpostor && (
                      <div className="bg-primary-foreground/10 rounded-card px-4 py-2 mb-3">
                        <span className="text-caption text-primary-foreground/60 uppercase tracking-wide">
                          Category
                        </span>
                        <p className="text-body font-bold text-primary-foreground">
                          {category}
                        </p>
                      </div>
                    )}
                    
                    {/* Show hint to impostor if enabled */}
                    {settings.showHintToImpostor && secretHint && (
                      <div className="bg-game-orange/20 rounded-card px-4 py-2 mb-3">
                        <span className="text-caption text-primary-foreground/60 uppercase tracking-wide">
                          Hint
                        </span>
                        <p className="text-body font-bold text-game-orange">
                          {secretHint}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-body text-primary-foreground/70">
                      {!settings.showCategoryToImpostor && !settings.showHintToImpostor 
                        ? "You don't know the word!\nBlend in and don't get caught."
                        : "Blend in and don't get caught!"}
                    </p>
                  </>
                ) : (
                  <>
                    <Mascot variant="yellow" size="lg" className="mx-auto mb-4" />
                    <div className="bg-primary-foreground/20 rounded-card px-6 py-3 mb-3">
                      <span className="text-caption text-primary-foreground/70 uppercase tracking-wide">
                        {category}
                      </span>
                      <h2 className="text-h1 text-primary-foreground">
                        {secretWord}
                      </h2>
                    </div>
                    <p className="text-body text-primary-foreground/70">
                      You're Crew! Find the Impostor.
                    </p>
                  </>
                )}

                {/* Auto-hide countdown */}
                {autoHideTimer !== null && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <span className="text-h3 text-primary-foreground">{autoHideTimer}</span>
                  </div>
                )}
              </div>
            )}
          </GameCard>

          {/* Action button */}
          <div className="mt-6">
            {isRevealed ? (
              <PillButton
                variant="dark"
                fullWidth
                icon={<EyeOff className="w-5 h-5" />}
                onClick={onDone}
              >
                Got it! Pass the phone
              </PillButton>
            ) : (
              <p className="text-center text-caption text-muted-foreground">
                Tap the card above to see your role
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
