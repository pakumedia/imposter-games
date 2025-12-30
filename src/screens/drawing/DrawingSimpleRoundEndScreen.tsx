import { RotateCcw, Settings, Users, Palette } from 'lucide-react';
import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';
import { GalleryCanvas } from '@/components/drawing';

interface DrawingSimpleRoundEndScreenProps {
  onRestartRound: () => void;
  onAdjustGame: () => void;
}

export function DrawingSimpleRoundEndScreen({ onRestartRound, onAdjustGame }: DrawingSimpleRoundEndScreenProps) {
  const { players, impostorId, secretWord, category, crewWins, impostorWins, roundNumber, lines } = useDrawingStore();
  
  const impostor = players.find(p => p.id === impostorId);
  const impostorName = impostor?.name || 'Unknown';

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-h1 text-foreground mb-2">Runde {roundNumber}</h1>
          <p className="text-body text-muted-foreground">Diskutiert und stimmt selbst ab!</p>
        </div>

        {/* Drawing Preview */}
        <GameCard color="white" className="mb-5 overflow-hidden">
          <div className="aspect-square bg-white">
            <GalleryCanvas lines={lines} size={300} />
          </div>
        </GameCard>

        {/* Word Reveal Card */}
        <GameCard color="blue" className="p-5 mb-4 text-center bg-[#0046FF]">
          <p className="text-caption text-white/80 mb-1">Das geheime Wort war</p>
          <h2 className="text-h2 text-white mb-1">{secretWord}</h2>
          <p className="text-body-sm text-white/70">Kategorie: {category}</p>
        </GameCard>

        {/* Impostor Reveal */}
        <GameCard color="dark" className="p-4 mb-5">
          <div className="flex items-center justify-center gap-3">
            <Palette className="w-6 h-6 text-white/60" />
            <div>
              <p className="text-caption text-white/60">Der Fake Artist war</p>
              <p className="text-h3 text-white">{impostorName}</p>
            </div>
            {impostor && (
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/30"
                style={{ backgroundColor: impostor.drawingColor }}
              />
            )}
          </div>
        </GameCard>

        {/* Score */}
        <div className="flex gap-3 mb-5">
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
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-5">
          <Users className="w-4 h-4" />
          <span className="text-body">{players.length} Spieler</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="space-y-3">
          <PillButton
            variant="skyblue"
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
