import { useState, useEffect, useCallback } from 'react';
import { AppShell, GameCard, PillButton, TimerChip } from '@/components/ui-kit';
import { DrawingCanvas } from '@/components/drawing';
import { useDrawingStore } from '@/game/drawing-store';
import { DrawingLine } from '@/game/drawing-types';
import { Check, Palette } from 'lucide-react';

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

  // Timer countdown
  useEffect(() => {
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
  }, []);

  const handleLineComplete = useCallback((line: DrawingLine) => {
    addLine(line);
    setHasDrawn(true);
  }, [addLine]);

  const handleFinishTurn = useCallback(() => {
    finishDrawingTurn();
    onTurnComplete();
  }, [finishDrawingTurn, onTurnComplete]);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col screen-padding py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground font-bold"
              style={{ backgroundColor: currentPlayer.drawingColor }}
            >
              {currentPlayer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-h3 text-foreground">{currentPlayer.name}'s Turn</h2>
              <p className="text-caption text-muted-foreground">
                Round {currentRound}/{maxDrawingRounds} • Draw ONE line!
              </p>
            </div>
          </div>
          <TimerChip seconds={timeLeft} variant={timeLeft <= 3 ? 'danger' : 'default'} />
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <GameCard color="white" className="w-full max-w-[400px] p-4">
            <DrawingCanvas
              lines={lines}
              playerColor={currentPlayer.drawingColor}
              playerId={currentPlayer.id}
              isDrawingEnabled={!hasDrawn}
              onLineComplete={handleLineComplete}
            />
          </GameCard>

          {/* Color indicator */}
          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Palette className="w-4 h-4" />
            <span className="text-caption">Your color:</span>
            <div 
              className="w-6 h-6 rounded-full border-2 border-foreground/20"
              style={{ backgroundColor: currentPlayer.drawingColor }}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
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
        <div className="mt-4 text-center text-caption text-muted-foreground">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>
    </AppShell>
  );
}
