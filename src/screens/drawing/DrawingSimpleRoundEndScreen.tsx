import { useState } from 'react';
import { RotateCcw, Settings, Users, Palette, Eye } from 'lucide-react';
import { AppShell, GameCard, PillButton } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';
import { GalleryCanvas } from '@/components/drawing';

interface DrawingSimpleRoundEndScreenProps {
  onRestartRound: () => void;
  onAdjustGame: () => void;
}

export function DrawingSimpleRoundEndScreen({ onRestartRound, onAdjustGame }: DrawingSimpleRoundEndScreenProps) {
  const { players, impostorId, secretWord, category, roundNumber, lines } = useDrawingStore();
  
  const [drawingRevealed, setDrawingRevealed] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);
  const [impostorRevealed, setImpostorRevealed] = useState(false);
  const [drawingShaking, setDrawingShaking] = useState(false);
  const [wordShaking, setWordShaking] = useState(false);
  const [impostorShaking, setImpostorShaking] = useState(false);
  
  const impostor = players.find(p => p.id === impostorId);
  const impostorName = impostor?.name || 'Unknown';

  const handleRevealDrawing = () => {
    if (drawingRevealed) return;
    setDrawingShaking(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    setTimeout(() => {
      setDrawingShaking(false);
      setDrawingRevealed(true);
    }, 1000);
  };

  const handleRevealWord = () => {
    if (wordRevealed) return;
    setWordShaking(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    setTimeout(() => {
      setWordShaking(false);
      setWordRevealed(true);
    }, 1000);
  };

  const handleRevealImpostor = () => {
    if (impostorRevealed) return;
    setImpostorShaking(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    setTimeout(() => {
      setImpostorShaking(false);
      setImpostorRevealed(true);
    }, 1000);
  };

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-h1 text-foreground mb-2">Runde {roundNumber}</h1>
          <p className="text-body text-muted-foreground">Diskutiert und stimmt selbst ab!</p>
        </div>

        {/* Drawing Preview - Tap to reveal */}
        <GameCard 
          color="white" 
          className={`mb-5 overflow-hidden cursor-pointer ${drawingShaking ? 'animate-shake' : ''}`}
          onClick={handleRevealDrawing}
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
          className={`p-5 mb-4 text-center bg-[#0046FF] cursor-pointer ${wordShaking ? 'animate-shake' : ''}`}
          onClick={handleRevealWord}
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
          className={`p-4 mb-5 cursor-pointer ${impostorShaking ? 'animate-shake' : ''}`}
          onClick={handleRevealImpostor}
        >
          {impostorRevealed ? (
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