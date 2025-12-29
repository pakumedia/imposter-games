import { AppShell, GameCard, PillButton, GameHeader } from '@/components/ui-kit';
import { Palette, ArrowRight } from 'lucide-react';
import { useDrawingStore } from '@/game/drawing-store';

interface DrawingPassTurnScreenProps {
  onConfirm: () => void;
  onExit?: () => void;
}

export function DrawingPassTurnScreen({ onConfirm, onExit }: DrawingPassTurnScreenProps) {
  const { players, currentPlayerIndex, currentRound, maxDrawingRounds } = useDrawingStore();
  const currentPlayer = players[currentPlayerIndex];

  return (
    <AppShell>
      <GameHeader onExit={onExit} />
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10">
        <GameCard 
          color="white" 
          className="w-full max-w-sm p-8 text-center animate-[scale-in_0.4s_ease-out,fade-in_0.4s_ease-out]"
        >
          {/* Icon with bounce animation */}
          <div className="w-20 h-20 rounded-full bg-game-blue/20 flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out_0.1s_both]">
            <Palette className="w-10 h-10 text-game-blue" />
          </div>

          {/* Instructions */}
          <h1 className="text-h2 text-foreground mb-3 animate-[fade-in_0.4s_ease-out_0.2s_both]">
            Pass the phone to
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-game-blue/10 rounded-pill px-5 py-3 mb-4 animate-[scale-in_0.5s_ease-out_0.3s_both]">
            <div 
              className={`w-8 h-8 rounded-full ${currentPlayer.avatarColor} flex items-center justify-center`}
            >
              <span className="text-primary-foreground font-bold text-caption">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-h3 text-game-blue font-extrabold">
              {currentPlayer.name}
            </span>
          </div>

          <p className="text-body text-muted-foreground mb-2 animate-[fade-in_0.4s_ease-out_0.4s_both]">
            It's your turn to draw!
          </p>
          
          <p className="text-caption text-muted-foreground mb-8 animate-[fade-in_0.4s_ease-out_0.5s_both]">
            Round {currentRound} of {maxDrawingRounds}
          </p>

          {/* Confirm button */}
          <div className="animate-[fade-in_0.4s_ease-out_0.6s_both]">
            <PillButton
              variant="primary"
              fullWidth
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={onConfirm}
            >
              I'm ready to draw!
            </PillButton>
          </div>
        </GameCard>

        {/* Progress indicator */}
        <div className="mt-6 text-caption text-muted-foreground animate-[fade-in_0.4s_ease-out_0.7s_both]">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>
    </AppShell>
  );
}
