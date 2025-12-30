import { useState, useEffect, useCallback } from 'react';
import { AppShell, GameCard, PillButton, Sparkles, ListRowPill } from '@/components/ui-kit';
import { GalleryCanvas } from '@/components/drawing';
import { ImpostorMascot } from '@/components/mascots';
import { useDrawingStore } from '@/game/drawing-store';
import { RotateCcw, Home, Trophy, Skull, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingResultsScreenProps {
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  onEndGame: () => void;
}

export function DrawingResultsScreen({ onPlayAgain, onBackToLobby, onEndGame }: DrawingResultsScreenProps) {
  const { players, impostorId, lines, calculateResults } = useDrawingStore();
  const [result, setResult] = useState<{ impostorCaught: boolean; impostorName: string } | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // Calculate results on mount
    const gameResult = calculateResults();
    setResult(gameResult);
    
    // Animate reveal
    setTimeout(() => setShowReveal(true), 500);
  }, []);

  const impostor = players.find(p => p.id === impostorId);
  const sortedPlayers = [...players].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const handleReveal = useCallback(() => {
    if (isRevealed) return;
    
    // Start shake animation
    setIsShaking(true);
    
    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    // After 1 second, reveal the content
    setTimeout(() => {
      setIsShaking(false);
      setIsRevealed(true);
    }, 1000);
  }, [isRevealed]);

  if (!result || !impostor) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body text-muted-foreground">Calculating results...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col screen-padding py-6 pb-32 overflow-y-auto animate-fade-in">
        {/* Result announcement */}
        <GameCard 
          color={result.impostorCaught ? 'teal' : 'dark'} 
          className="p-6 mb-6 text-center relative overflow-hidden"
        >
          <Sparkles count={12} className="absolute inset-0" />
          
          <div className={cn(
            'transition-all duration-500',
            showReveal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}>
            {result.impostorCaught ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-h1 text-primary-foreground mb-2">
                  Artists Win!
                </h1>
                <p className="text-body text-primary-foreground/70">
                  The Fake Artist was caught!
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                  <Skull className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-h1 text-primary-foreground mb-2">
                  Fake Artist Wins!
                </h1>
                <p className="text-body text-primary-foreground/70">
                  They got away with it!
                </p>
              </>
            )}
          </div>
        </GameCard>

        {/* The impostor reveal - tap to show */}
        <GameCard 
          color="white" 
          className={cn(
            "p-5 mb-6 cursor-pointer transition-all",
            isShaking && "animate-shake"
          )}
          onClick={handleReveal}
        >
          {!isRevealed ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Eye className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-body text-muted-foreground font-medium">
                Tippe zum Enthüllen
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 animate-scale-in">
              <ImpostorMascot size="md" />
              <div className="flex-1">
                <p className="text-caption text-muted-foreground">The Fake Artist was</p>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground font-bold"
                    style={{ backgroundColor: impostor.drawingColor }}
                  >
                    {impostor.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-h2 text-destructive">{impostor.name}</h2>
                </div>
              </div>
            </div>
          )}
        </GameCard>

        {/* The drawing with impostor highlight - only show after reveal */}
        {isRevealed && (
          <div className="animate-scale-in">
            <div className="flex justify-center mb-6">
              <GalleryCanvas 
                lines={lines} 
                size={200} 
                highlightPlayerId={impostorId}
              />
            </div>
            <p className="text-center text-caption text-muted-foreground mb-6">
              Red dashed lines = Fake Artist's strokes
            </p>
          </div>
        )}

        {/* Vote results */}
        <div className="mb-6">
          <h3 className="text-h3 text-foreground mb-3">Vote Results</h3>
          <div className="space-y-2">
            {sortedPlayers.map((player) => (
              <ListRowPill
                key={player.id}
                avatarColor={player.avatarColor}
                name={player.name}
                subtitle={`${player.votes || 0} votes`}
                isHighlighted={player.id === impostorId && isRevealed}
                rightContent={
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: player.drawingColor }}
                    />
                    {player.id === impostorId && isRevealed && (
                      <span className="text-caption font-bold text-destructive">FAKE</span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <PillButton
            variant="primary"
            fullWidth
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={onPlayAgain}
          >
            Play Again
          </PillButton>
          <PillButton
            variant="secondary"
            fullWidth
            icon={<Home className="w-5 h-5" />}
            onClick={onBackToLobby}
          >
            Back to Lobby
          </PillButton>
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
