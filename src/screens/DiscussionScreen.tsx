import { useState, useEffect, useCallback } from 'react';
import { AppShell, GameCard, PillButton, TimerChip, ListRowPill } from '@/components/ui-kit';
import { MessageSquare, Vote, Play, Pause } from 'lucide-react';
import { useGameStore } from '@/game/store';

interface DiscussionScreenProps {
  onGoToVoting: () => void;
}

export function DiscussionScreen({ onGoToVoting }: DiscussionScreenProps) {
  const { players, settings, category } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(settings.discussionTimeSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 30;

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-h2 text-foreground">Discussion</h1>
            <p className="text-caption text-muted-foreground">
              Give hints about "{category}"
            </p>
          </div>
          <TimerChip seconds={timeLeft} isWarning={isWarning} />
        </div>

        {/* Big timer card */}
        <GameCard 
          color={isWarning ? 'orange' : 'teal'} 
          className="p-8 text-center mb-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <MessageSquare className="w-8 h-8 text-primary-foreground/80" />
            <span className="text-body text-primary-foreground/80 font-semibold">
              Time Remaining
            </span>
          </div>
          <div className="text-6xl font-extrabold text-primary-foreground mb-4">
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-primary-foreground/20 text-primary-foreground text-caption font-semibold tap-scale"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </GameCard>

        {/* Instructions */}
        <GameCard color="white" className="p-5 mb-6">
          <h3 className="font-bold text-body text-foreground mb-3 flex items-center gap-2">
            🗣️ Take turns giving hints
          </h3>
          <ul className="text-body-sm text-muted-foreground space-y-2">
            <li>• Each player says ONE word related to the secret</li>
            <li>• The Impostor must blend in!</li>
            <li>• Watch for suspicious hints 👀</li>
          </ul>
        </GameCard>

        {/* Player order */}
        <div className="mb-6">
          <h3 className="text-h3 text-foreground mb-3">Player Order</h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <ListRowPill
                key={player.id}
                avatarColor={player.avatarColor}
                name={player.name}
                subtitle={`Hint #${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Go to voting button */}
        <PillButton
          variant="primary"
          fullWidth
          icon={<Vote className="w-5 h-5" />}
          onClick={onGoToVoting}
        >
          Start Voting
        </PillButton>
      </div>
    </AppShell>
  );
}
