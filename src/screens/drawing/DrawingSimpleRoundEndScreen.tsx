import { useState } from 'react';
import { RotateCcw, Settings, Users, Eye } from 'lucide-react';
import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';
import { GalleryCanvas } from '@/components/drawing';

interface DrawingSimpleRoundEndScreenProps {
  onRestartRound: () => void;
  onAdjustGame: () => void;
  onEndGame: () => void;
}

export function DrawingSimpleRoundEndScreen({ onRestartRound, onAdjustGame, onEndGame }: DrawingSimpleRoundEndScreenProps) {
  const { players, impostorId, secretWord, category, roundNumber, lines } = useDrawingStore();
  
  const [drawingRevealed, setDrawingRevealed] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);
  const [impostorRevealed, setImpostorRevealed] = useState(false);
  
  const impostor = players.find(p => p.id === impostorId);
  const impostorName = impostor?.name || 'Unknown';

  return (
    <AppShell>
      <div className="flex-1 flex flex-col screen-padding py-6 animate-fade-in overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-h1 text-foreground mb-2">Runde {roundNumber}</h1>
          <p className="text-body text-muted-foreground">Diskutiert und stimmt selbst ab!</p>
        </div>

        {/* Drawing Preview - Tap to reveal */}
        <GameCard 
          color="white" 
          className="mb-5 overflow-hidden cursor-pointer"
          onClick={() => setDrawingRevealed(true)}
        >
          {drawingRevealed ? (
            <div className="aspect-square bg-white">
              <GalleryCanvas lines={lines} size={300} />
            </div>
          ) : (
            <div className="aspect-square bg-muted flex flex-col items-center justify-center gap-2">
              <Eye className="w-10 h-10 text-muted-foreground" />
              <p className="text-body text-muted-foreground">Tippe um die Zeichnung zu sehen</p>
            </div>
          )}
        </GameCard>

        {/* Word Reveal Card - Tap to reveal */}
        <GameCard 
          color="blue" 
          className="p-5 mb-4 text-center bg-[#0046FF] cursor-pointer"
          onClick={() => setWordRevealed(true)}
        >
          {wordRevealed ? (
            <>
              <p className="text-caption text-white/80 mb-1">Das geheime Wort war</p>
              <h2 className="text-h2 text-white mb-1">{secretWord}</h2>
              <p className="text-body-sm text-white/70">Kategorie: {category}</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <Eye className="w-6 h-6 text-white/60" />
              <p className="text-body text-white/80">Tippe um das Wort zu enthüllen</p>
            </div>
          )}
        </GameCard>

        {/* Impostor Reveal - Tap to reveal */}
        <GameCard 
          color="dark" 
          className="p-4 mb-5 cursor-pointer"
          onClick={() => setImpostorRevealed(true)}
        >
          {impostorRevealed ? (
            <div className="text-center">
              <p className="text-caption text-white/60 mb-1">Der Fake Artist war</p>
              <p className="text-h3 text-white">{impostorName}</p>
              {impostor && (
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/30 mx-auto mt-2"
                  style={{ backgroundColor: impostor.drawingColor }}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <Eye className="w-6 h-6 text-white/60" />
              <p className="text-body text-white/80">Tippe um den Fake Artist zu enthüllen</p>
            </div>
          )}
        </GameCard>

        {/* Players count */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-5">
          <Users className="w-4 h-4" />
          <span className="text-body">{players.length} Spieler</span>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1 min-h-8" />

        {/* Actions - always at bottom */}
        <div className="space-y-3 pb-8">
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
            className="w-full flex items-center justify-center gap-2 py-4 bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground rounded-2xl transition-colors tap-scale"
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold">Spiel anpassen</span>
          </button>
          
          <button 
            onClick={onEndGame}
            className="w-full flex items-center justify-center gap-2 py-4 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-2xl transition-colors tap-scale"
          >
            <span className="font-bold">Spiel beenden</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}