import { useState, useEffect } from 'react';
import { AppShell, GameCard, PillButton, Sparkles, GameHeader } from '@/components/ui-kit';
import { Mascot, ImpostorMascot } from '@/components/mascots';
import { Eye, EyeOff, Palette } from 'lucide-react';
import { useDrawingStore } from '@/game/drawing-store';
import { cn } from '@/lib/utils';

interface DrawingRevealScreenProps {
  onDone: () => void;
  onExit?: () => void;
}

export function DrawingRevealScreen({ onDone, onExit }: DrawingRevealScreenProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState<number | null>(null);
  const { players, currentPlayerIndex, secretWord, category, impostorId } = useDrawingStore();
  
  const currentPlayer = players[currentPlayerIndex];
  const isImpostor = currentPlayer.id === impostorId;

  useEffect(() => {
    if (isRevealed) {
      const timer = window.setTimeout(() => {
        setIsRevealed(false);
        setAutoHideTimer(null);
      }, 6000);
      
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
      <GameHeader onExit={onExit} />
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
        <div className="w-full max-w-sm">
          {/* Player name */}
          <div className="text-center mb-6">
            <span className="text-caption text-muted-foreground uppercase tracking-wide">
              {currentPlayer.name}'s Role
            </span>
          </div>

          {/* The card */}
          <GameCard 
            color={isRevealed ? (isImpostor ? 'dark' : 'blue') : 'white'}
            className={cn(
              'min-h-[380px] flex flex-col items-center justify-center p-8 relative overflow-hidden transition-all duration-500',
              !isRevealed && 'cursor-pointer tap-scale'
            )}
            onClick={!isRevealed ? handleTapToReveal : undefined}
          >
            {!isRevealed ? (
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
              <div className="text-center animate-scale-in">
                <Sparkles count={8} className="absolute inset-0" />
                
                {isImpostor ? (
                  <>
                    <ImpostorMascot size="lg" className="mx-auto mb-4" />
                    <h2 className="text-h1 text-destructive mb-2 animate-pulse-soft">
                      FAKE ARTIST
                    </h2>
                    <p className="text-body text-primary-foreground/70">
                      You don't know the word!<br />
                      Draw something that blends in.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-primary-foreground/50">
                      <Palette className="w-4 h-4" />
                      <span className="text-caption">Your color:</span>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-primary-foreground/30"
                        style={{ backgroundColor: currentPlayer.drawingColor }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Mascot variant="blue" size="lg" className="mx-auto mb-4" />
                    <div className="bg-primary-foreground/20 rounded-card px-6 py-3 mb-3">
                      <span className="text-caption text-primary-foreground/70 uppercase tracking-wide">
                        {category}
                      </span>
                      <h2 className="text-h1 text-primary-foreground">
                        {secretWord}
                      </h2>
                    </div>
                    <p className="text-body text-primary-foreground/70">
                      Draw this! Find the Fake Artist.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-primary-foreground/50">
                      <Palette className="w-4 h-4" />
                      <span className="text-caption">Your color:</span>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-primary-foreground/30"
                        style={{ backgroundColor: currentPlayer.drawingColor }}
                      />
                    </div>
                  </>
                )}

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
