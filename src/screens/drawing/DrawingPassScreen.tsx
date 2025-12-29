import { AppShell, GameCard, PillButton, GameHeader } from '@/components/ui-kit';
import { Mascot } from '@/components/mascots';
import { ArrowRight, Palette } from 'lucide-react';
import { useDrawingStore } from '@/game/drawing-store';

interface DrawingPassScreenProps {
  onConfirm: () => void;
  onExit?: () => void;
}

export function DrawingPassScreen({ onConfirm, onExit }: DrawingPassScreenProps) {
  const { players, currentPlayerIndex } = useDrawingStore();
  const currentPlayer = players[currentPlayerIndex];

  const mascotVariants = ['yellow', 'blue', 'purple', 'pink', 'orange'] as const;
  const mascotVariant = mascotVariants[currentPlayerIndex % mascotVariants.length];

  return (
    <AppShell>
      <GameHeader onExit={onExit} />
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
        <GameCard color="white" className="w-full max-w-sm p-8 text-center">
          {/* Mascot */}
          <div className="mb-6 flex justify-center">
            <Mascot variant={mascotVariant} size="lg" className="animate-bounce-soft" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-game-blue/20 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-game-blue" />
          </div>

          {/* Instructions */}
          <h1 className="text-h2 text-foreground mb-3">
            Pass the phone to
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-game-blue/10 rounded-pill px-5 py-3 mb-6">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentPlayer.drawingColor }}
            >
              <span className="text-foreground font-bold text-caption">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-h3 text-game-blue font-extrabold">
              {currentPlayer.name}
            </span>
          </div>

          <p className="text-body text-muted-foreground mb-8">
            Make sure no one else can see the screen!
          </p>

          {/* Confirm button */}
          <PillButton
            variant="primary"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={onConfirm}
          >
            I'm {currentPlayer.name}
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
