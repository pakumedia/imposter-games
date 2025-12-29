import { useState, useEffect } from 'react';
import { AppShell, GameCard, PillButton, TimerChip, ListRowPill } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';
import { Vote, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingVotingScreenProps {
  onComplete: () => void;
}

export function DrawingVotingScreen({ onComplete }: DrawingVotingScreenProps) {
  const { players, votingTimeSeconds, castVote, votes } = useDrawingStore();
  const [timeLeft, setTimeLeft] = useState(votingTimeSeconds);
  const [currentVoterId, setCurrentVoterId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Find the first player who hasn't voted
  useEffect(() => {
    const nextVoter = players.find(p => !p.hasVoted);
    if (nextVoter) {
      setCurrentVoterId(nextVoter.id);
      setSelectedPlayerId(null);
    } else {
      // All players have voted
      onComplete();
    }
  }, [players, votes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentVoter = players.find(p => p.id === currentVoterId);
  const votablePlayers = players.filter(p => p.id !== currentVoterId);

  const handleVote = () => {
    if (currentVoterId && selectedPlayerId) {
      castVote(currentVoterId, selectedPlayerId);
    }
  };

  if (!currentVoter) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body text-muted-foreground">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col screen-padding py-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-game-orange/20 flex items-center justify-center">
              <Vote className="w-6 h-6 text-game-orange" />
            </div>
            <div>
              <h1 className="text-h2 text-foreground">Voting</h1>
              <p className="text-caption text-muted-foreground">
                {currentVoter.name}'s turn to vote
              </p>
            </div>
          </div>
          <TimerChip 
            seconds={timeLeft} 
            variant={timeLeft <= 10 ? 'danger' : 'default'}
          />
        </div>

        {/* Current voter indicator */}
        <GameCard color="blue" className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground font-bold"
              style={{ backgroundColor: currentVoter.drawingColor }}
            >
              {currentVoter.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-body font-bold text-foreground">{currentVoter.name}</h3>
              <p className="text-caption text-foreground/70">Who do you think is the Fake Artist?</p>
            </div>
          </div>
        </GameCard>

        {/* Player voting options */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {votablePlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              className={cn(
                'w-full transition-all tap-scale',
                selectedPlayerId === player.id && 'scale-[1.02]'
              )}
            >
              <ListRowPill
                avatarColor={player.avatarColor}
                name={player.name}
                rightContent={
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: player.drawingColor }}
                    />
                    {selectedPlayerId === player.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                }
                highlight={selectedPlayerId === player.id}
              />
            </button>
          ))}
        </div>

        {/* Confirm vote button */}
        <div className="mt-6">
          <PillButton
            variant="primary"
            fullWidth
            icon={<Vote className="w-5 h-5" />}
            onClick={handleVote}
            disabled={!selectedPlayerId}
          >
            {selectedPlayerId ? 'Confirm Vote' : 'Select a player'}
          </PillButton>
        </div>

        {/* Progress */}
        <div className="mt-3 text-center text-caption text-muted-foreground">
          {players.filter(p => p.hasVoted).length} of {players.length} voted
        </div>
      </div>
    </AppShell>
  );
}
