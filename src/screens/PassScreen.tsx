import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { Mascot } from '@/components/mascots';
import { ArrowRight } from 'lucide-react';
import { useGameStore } from '@/game/store';

interface PassScreenProps {
  onConfirm: () => void;
}

export function PassScreen({ onConfirm }: PassScreenProps) {
  const { players, currentPlayerIndex } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  const mascotVariants = ['yellow', 'blue', 'purple', 'pink', 'orange'] as const;
  const mascotVariant = mascotVariants[currentPlayerIndex % mascotVariants.length];

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
        <GameCard color="white" className="w-full max-w-sm p-8 text-center">
          {/* Mascot */}
          <div className="mb-6 flex justify-center">
            <Mascot variant={mascotVariant} size="lg" className="animate-bounce-soft" />
          </div>

          {/* Instructions */}
          <h1 className="text-h2 text-foreground mb-3">
            Pass the phone to
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-pill px-5 py-3 mb-6">
            <div className={`w-8 h-8 rounded-full ${currentPlayer.avatarColor} flex items-center justify-center`}>
              <span className="text-primary-foreground font-bold text-caption">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-h3 text-primary font-extrabold">
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
