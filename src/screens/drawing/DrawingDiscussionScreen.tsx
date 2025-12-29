import { useState, useEffect } from 'react';
import { AppShell, GameCard, PillButton, TimerChip, ListRowPill, GameHeader } from '@/components/ui-kit';
import { GalleryCanvas } from '@/components/drawing';
import { useDrawingStore } from '@/game/drawing-store';
import { Vote, MessageCircle } from 'lucide-react';

interface DrawingDiscussionScreenProps {
  onGoToVoting: () => void;
  onExit?: () => void;
}

export function DrawingDiscussionScreen({ onGoToVoting, onExit }: DrawingDiscussionScreenProps) {
  const { lines, players, discussionTimeSeconds } = useDrawingStore();
  const [timeLeft, setTimeLeft] = useState(discussionTimeSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppShell>
      <GameHeader onExit={onExit} />
      <div className="flex-1 flex flex-col screen-padding py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-game-blue/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-game-blue" />
            </div>
            <div>
              <h1 className="text-h2 text-foreground">Discussion</h1>
              <p className="text-caption text-muted-foreground">Who's the Fake Artist?</p>
            </div>
          </div>
          <TimerChip 
            seconds={timeLeft} 
            isWarning={timeLeft <= 10}
          />
        </div>

        {/* Canvas preview */}
        <GameCard color="white" className="p-3 mb-6 flex justify-center">
          <GalleryCanvas lines={lines} size={200} />
        </GameCard>

        {/* Players list with colors */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-caption text-muted-foreground mb-3">Suspects</h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <ListRowPill
                key={player.id}
                avatarColor={player.avatarColor}
                name={player.name}
                subtitle={`Player ${index + 1}`}
                rightContent={
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-foreground/20"
                    style={{ backgroundColor: player.drawingColor }}
                  />
                }
              />
            ))}
          </div>
        </div>

        {/* Vote button */}
        <div className="mt-6">
          <PillButton
            variant="primary"
            fullWidth
            icon={<Vote className="w-5 h-5" />}
            onClick={onGoToVoting}
          >
            Start Voting
          </PillButton>
        </div>
      </div>
    </AppShell>
  );
}
