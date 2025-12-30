import { useState } from 'react';
import { RotateCcw, Settings, Users, Eye } from 'lucide-react';
import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { useGameStore } from '@/game/store';

interface SimpleRoundEndScreenProps {
  onRestartRound: () => void;
  onAdjustGame: () => void;
}

export function SimpleRoundEndScreen({ onRestartRound, onAdjustGame }: SimpleRoundEndScreenProps) {
  const { players, impostorIds, secretWord, category, roundNumber } = useGameStore();
  
  const [wordRevealed, setWordRevealed] = useState(false);
  const [impostorRevealed, setImpostorRevealed] = useState(false);
  
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

        {/* Word Reveal Card - Tap to reveal */}
        <GameCard 
          color="orange" 
          className="p-6 mb-5 text-center cursor-pointer"
          onClick={() => setWordRevealed(true)}
        >
          {wordRevealed ? (
            <>
              <p className="text-caption text-white/80 mb-1">Das geheime Wort war</p>
              <h2 className="text-h1 text-white mb-2">{secretWord}</h2>
              <p className="text-body text-white/70">Kategorie: {category}</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Eye className="w-8 h-8 text-white/60" />
              <p className="text-body text-white/80">Tippe um das Wort zu enthüllen</p>
            </div>
          )}
        </GameCard>

        {/* Impostor Reveal - Tap to reveal */}
        <GameCard 
          color="dark" 
          className="p-5 mb-5 cursor-pointer"
          onClick={() => setImpostorRevealed(true)}
        >
          {impostorRevealed ? (
            <div className="text-center">
              <p className="text-caption text-white/60 mb-1">
                {impostorIds.length > 1 ? 'Die Impostors waren' : 'Der Impostor war'}
              </p>
              <p className="text-h3 text-white">{impostorNames}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <Eye className="w-6 h-6 text-white/60" />
              <p className="text-body text-white/80">Tippe um den Impostor zu enthüllen</p>
            </div>
          )}
        </GameCard>

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