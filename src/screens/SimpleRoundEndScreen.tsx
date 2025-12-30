import { RotateCcw, Settings, Users } from 'lucide-react';
import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { useGameStore } from '@/game/store';

interface SimpleRoundEndScreenProps {
  onRestartRound: () => void;
  onAdjustGame: () => void;
}

export function SimpleRoundEndScreen({ onRestartRound, onAdjustGame }: SimpleRoundEndScreenProps) {
  const { players, impostorIds, secretWord, category, crewWins, impostorWins, roundNumber } = useGameStore();
  
  const impostorNames = players
    .filter(p => impostorIds.includes(p.id))
    .map(p => p.name)
    .join(', ');

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-8 pb-32 animate-fade-in overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-h1 text-foreground mb-2">Runde {roundNumber}</h1>
          <p className="text-body text-muted-foreground">Diskutiert und stimmt selbst ab!</p>
        </div>

        {/* Word Reveal Card */}
        <GameCard color="orange" className="p-6 mb-5 text-center">
          <p className="text-caption text-white/80 mb-1">Das geheime Wort war</p>
          <h2 className="text-h1 text-white mb-2">{secretWord}</h2>
          <p className="text-body text-white/70">Kategorie: {category}</p>
        </GameCard>

        {/* Impostor Reveal */}
        <GameCard color="dark" className="p-5 mb-5">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🕵️</span>
            <div>
              <p className="text-caption text-white/60">
                {impostorIds.length > 1 ? 'Die Impostors waren' : 'Der Impostor war'}
              </p>
              <p className="text-h3 text-white">{impostorNames}</p>
            </div>
          </div>
        </GameCard>

        {/* Score */}
        <div className="flex gap-3 mb-6">
          <GameCard color="subtle" className="flex-1 p-4 text-center">
            <p className="text-caption text-muted-foreground mb-1">Crew</p>
            <p className="text-h2 text-foreground">{crewWins}</p>
          </GameCard>
          <GameCard color="subtle" className="flex-1 p-4 text-center">
            <p className="text-caption text-muted-foreground mb-1">Impostor</p>
            <p className="text-h2 text-foreground">{impostorWins}</p>
          </GameCard>
        </div>

        {/* Players count */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
          <Users className="w-4 h-4" />
          <span className="text-body">{players.length} Spieler</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="space-y-3">
          <PillButton
            variant="orange"
            fullWidth
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={onRestartRound}
          >
            Neue Runde
          </PillButton>
          
          <button 
            onClick={onAdjustGame}
            className="w-full flex items-center justify-center gap-2 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-colors tap-scale"
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold">Spiel anpassen</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
