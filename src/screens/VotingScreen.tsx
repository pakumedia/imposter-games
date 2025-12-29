import { useState } from 'react';
import { AppShell, GameCard, PillButton, ListRowPill, IconButton } from '@/components/ui-kit';
import { Vote, Check, X, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { cn } from '@/lib/utils';

interface VotingScreenProps {
  onComplete: () => void;
}

export function VotingScreen({ onComplete }: VotingScreenProps) {
  const { players, castVote, votes } = useGameStore();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentVoter = players[currentVoterIndex];
  const allVoted = currentVoterIndex >= players.length;

  // Filter out current voter from options
  const voteOptions = players.filter(p => p.id !== currentVoter?.id);

  const handleSelectVote = (playerId: string) => {
    setSelectedVote(playerId);
    setShowConfirm(true);
  };

  const handleConfirmVote = () => {
    if (selectedVote && currentVoter) {
      castVote(currentVoter.id, selectedVote);
      setSelectedVote(null);
      setShowConfirm(false);
      
      if (currentVoterIndex + 1 >= players.length) {
        // All done voting
        onComplete();
      } else {
        setCurrentVoterIndex(prev => prev + 1);
      }
    }
  };

  const handleCancelVote = () => {
    setSelectedVote(null);
    setShowConfirm(false);
  };

  if (allVoted) {
    return null; // Will transition to results
  }

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-h2 text-foreground">Voting Time</h1>
            <span className="text-caption text-muted-foreground">
              {currentVoterIndex + 1}/{players.length}
            </span>
          </div>
        </div>

        {/* Current voter */}
        <GameCard color="yellow" className="p-5 mb-6">
          <div className="text-center">
            <p className="text-caption text-foreground/70 mb-2">It's your turn to vote</p>
            <div className="inline-flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${currentVoter.avatarColor} flex items-center justify-center`}>
                <span className="text-primary-foreground font-bold text-h3">
                  {currentVoter.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-h2 text-foreground">{currentVoter.name}</span>
            </div>
          </div>
        </GameCard>

        {/* Voting options */}
        {!showConfirm ? (
          <>
            <h3 className="text-h3 text-foreground mb-3">Who is the Impostor?</h3>
            <div className="space-y-3">
              {voteOptions.map((player) => (
                <ListRowPill
                  key={player.id}
                  avatarColor={player.avatarColor}
                  name={player.name}
                  onClick={() => handleSelectVote(player.id)}
                  rightContent={
                    <Vote className="w-5 h-5 text-muted-foreground" />
                  }
                />
              ))}
            </div>

            <p className="text-center text-caption text-muted-foreground mt-6">
              Tap a player to vote for them
            </p>
          </>
        ) : (
          /* Confirmation */
          <GameCard color="white" className="p-6 text-center animate-scale-in">
            <h3 className="text-h3 text-foreground mb-4">
              Vote for {players.find(p => p.id === selectedVote)?.name}?
            </h3>
            
            <div className="flex gap-3">
              <PillButton
                variant="outline"
                fullWidth
                icon={<X className="w-5 h-5" />}
                iconPosition="left"
                onClick={handleCancelVote}
              >
                Cancel
              </PillButton>
              <PillButton
                variant="primary"
                fullWidth
                icon={<Check className="w-5 h-5" />}
                onClick={handleConfirmVote}
              >
                Confirm
              </PillButton>
            </div>
          </GameCard>
        )}

        {/* Pass phone reminder */}
        {!showConfirm && currentVoterIndex > 0 && (
          <GameCard color="teal" className="mt-6 p-4">
            <p className="text-caption text-primary-foreground text-center">
              🔒 Make sure only {currentVoter.name} can see the screen!
            </p>
          </GameCard>
        )}
      </div>
    </AppShell>
  );
}
