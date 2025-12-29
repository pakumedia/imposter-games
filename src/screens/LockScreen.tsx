import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { Lock, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/game/store';

interface LockScreenProps {
  onContinue: () => void;
}

export function LockScreen({ onContinue }: LockScreenProps) {
  const { players, currentPlayerIndex } = useGameStore();
  const isLastPlayer = currentPlayerIndex >= players.length - 1;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col bg-game-dark paper-texture">
        <div className="flex-1 flex flex-col items-center justify-center screen-padding py-10 animate-fade-in">
          {/* Lock icon */}
          <div className="w-24 h-24 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-8 animate-bounce-soft">
            <Lock className="w-12 h-12 text-primary-foreground/60" />
          </div>

          <h1 className="text-h1 text-primary-foreground text-center mb-4">
            Screen Locked
          </h1>

          <p className="text-body text-primary-foreground/60 text-center mb-8 max-w-xs">
            {isLastPlayer 
              ? "Everyone has seen their cards. Time to discuss!"
              : "Pass the phone to the next player."
            }
          </p>

          <PillButton
            variant="primary"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={onContinue}
          >
            {isLastPlayer ? "Start Discussion" : "Next Player"}
          </PillButton>
        </div>
      </div>
    </AppShell>
  );
}
