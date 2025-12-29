import { useState, useEffect, useCallback, useRef } from 'react';
import { AppShell, GameCard, PillButton, TimerChip } from '@/components/ui-kit';
import { DrawingCanvas } from '@/components/drawing';
import { useDrawingStore } from '@/game/drawing-store';
import { DrawingLine, PALETTE_COLORS } from '@/game/drawing-types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingTurnScreenProps {
  onTurnComplete: () => void;
}

export function DrawingTurnScreen({ onTurnComplete }: DrawingTurnScreenProps) {
  const { 
    players, 
    currentPlayerIndex, 
    lines, 
    addLine, 
    finishDrawingTurn,
    drawingTimePerPlayer,
    currentRound,
    maxDrawingRounds 
  } = useDrawingStore();
  
  const currentPlayer = players[currentPlayerIndex];
  const [timeLeft, setTimeLeft] = useState(drawingTimePerPlayer);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]); // Black default
  const hasFinishedRef = useRef(false);

  const handleFinishTurn = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    finishDrawingTurn();
    onTurnComplete();
  }, [finishDrawingTurn, onTurnComplete]);

  // Timer countdown - reset when player changes
  useEffect(() => {
    hasFinishedRef.current = false;
    setHasDrawn(false);
    setTimeLeft(drawingTimePerPlayer);
    setSelectedColor(PALETTE_COLORS[0]); // Reset to black
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTurn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayerIndex, drawingTimePerPlayer, handleFinishTurn]);

  const handleLineComplete = useCallback((line: DrawingLine) => {
    addLine(line);
    setHasDrawn(true);
  }, [addLine]);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col screen-padding py-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-full ${currentPlayer.avatarColor} flex items-center justify-center`}
            >
              <span className="text-primary-foreground font-bold">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-h3 text-foreground">{currentPlayer.name}</h2>
              <p className="text-caption text-muted-foreground">
                Round {currentRound}/{maxDrawingRounds} • Draw ONE line!
              </p>
            </div>
          </div>
          <TimerChip seconds={timeLeft} isWarning={timeLeft <= 3} />
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          <GameCard color="white" className="w-full max-w-[400px] p-3">
            <DrawingCanvas
              lines={lines}
              playerColor={selectedColor}
              playerId={currentPlayer.id}
              isDrawingEnabled={!hasDrawn}
              onLineComplete={handleLineComplete}
            />
          </GameCard>
        </div>

        {/* Color Palette */}
        <div className="py-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => !hasDrawn && setSelectedColor(color)}
                disabled={hasDrawn}
                className={cn(
                  'w-9 h-9 rounded-full transition-all tap-scale',
                  'border-2',
                  selectedColor === color 
                    ? 'border-foreground scale-110 shadow-button' 
                    : 'border-border',
                  hasDrawn && 'opacity-50 cursor-not-allowed',
                  color === '#FFFFFF' && 'border-muted-foreground'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Action button */}
        <div>
          <PillButton
            variant={hasDrawn ? 'primary' : 'secondary'}
            fullWidth
            icon={<Check className="w-5 h-5" />}
            onClick={handleFinishTurn}
            disabled={!hasDrawn}
          >
            {hasDrawn ? 'Done! Next Player' : 'Draw something first...'}
          </PillButton>
        </div>

        {/* Progress */}
        <div className="mt-3 text-center text-caption text-muted-foreground">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>
    </AppShell>
  );
}
