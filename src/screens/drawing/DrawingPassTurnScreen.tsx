import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { Palette, ArrowRight } from 'lucide-react';
import { useDrawingStore } from '@/game/drawing-store';

interface DrawingPassTurnScreenProps {
  onConfirm: () => void;
}

export function DrawingPassTurnScreen({ onConfirm }: DrawingPassTurnScreenProps) {
  const { players, currentPlayerIndex, currentRound, maxDrawingRounds } = useDrawingStore();
  const currentPlayer = players[currentPlayerIndex];

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
        <GameCard color="white" className="w-full max-w-sm p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-game-blue/20 flex items-center justify-center mx-auto mb-6">
            <Palette className="w-10 h-10 text-game-blue" />
          </div>

          {/* Instructions */}
          <h1 className="text-h2 text-foreground mb-3">
            Pass the phone to
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-game-blue/10 rounded-pill px-5 py-3 mb-4">
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

          <p className="text-body text-muted-foreground mb-2">
            It's your turn to draw!
          </p>
          
          <p className="text-caption text-muted-foreground mb-8">
            Round {currentRound} of {maxDrawingRounds}
          </p>

          {/* Confirm button */}
          <PillButton
            variant="primary"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={onConfirm}
          >
            I'm ready to draw!
          </PillButton>
        </GameCard>

        {/* Progress indicator */}
        <div className="mt-6 text-caption text-muted-foreground">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>
    </AppShell>
  );
}
