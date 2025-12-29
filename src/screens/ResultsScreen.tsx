import { useEffect, useState } from 'react';
import { AppShell, GameCard, PillButton, ListRowPill, Sparkles } from '@/components/ui-kit';
import { Mascot, ImpostorMascot } from '@/components/mascots';
import { Trophy, RotateCcw, Home, Users } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { cn } from '@/lib/utils';

interface ResultsScreenProps {
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export function ResultsScreen({ onPlayAgain, onBackToLobby }: ResultsScreenProps) {
  const { players, impostorId, secretWord, category, crewWins, impostorWins, votes } = useGameStore();
  const [showResult, setShowResult] = useState(false);

  const impostor = players.find(p => p.id === impostorId)!;
  
  // Calculate who got most votes
  const voteCounts = players.map(p => ({
    ...p,
    voteCount: Object.values(votes).filter(v => v === p.id).length
  }));
  const sortedByVotes = [...voteCounts].sort((a, b) => b.voteCount - a.voteCount);
  const mostVoted = sortedByVotes[0];
  const impostorCaught = mostVoted.id === impostorId;

  useEffect(() => {
    // Dramatic reveal delay
    const timer = setTimeout(() => setShowResult(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32">
        {/* Pre-reveal suspense */}
        {!showResult ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-pulse-soft">
            <div className="w-24 h-24 rounded-full bg-game-yellow flex items-center justify-center mb-6">
              <span className="text-4xl">🎭</span>
            </div>
            <h1 className="text-h1 text-foreground text-center">
              Counting votes...
            </h1>
          </div>
        ) : (
          /* Results revealed */
          <div className="animate-fade-in">
            {/* Result card */}
            <GameCard 
              color={impostorCaught ? 'teal' : 'orange'} 
              className="p-8 text-center relative overflow-hidden mb-6"
            >
              <Sparkles count={12} className="absolute inset-0" />
              
              <div className="relative z-10">
                {impostorCaught ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-h1 text-primary-foreground mb-2">
                      Crew Wins!
                    </h1>
                    <p className="text-body text-primary-foreground/80">
                      The Impostor was caught!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">😈</div>
                    <h1 className="text-h1 text-foreground mb-2">
                      Impostor Wins!
                    </h1>
                    <p className="text-body text-foreground/80">
                      They fooled everyone!
                    </p>
                  </>
                )}
              </div>
            </GameCard>

            {/* The Impostor reveal */}
            <GameCard color="dark" className="p-6 mb-6">
              <div className="flex items-center gap-4">
                <ImpostorMascot size="sm" />
                <div>
                  <p className="text-caption text-primary-foreground/60">The Impostor was</p>
                  <h2 className="text-h2 text-primary-foreground">{impostor.name}</h2>
                </div>
              </div>
            </GameCard>

            {/* The secret word */}
            <GameCard color="yellow" className="p-5 mb-6">
              <div className="text-center">
                <p className="text-caption text-foreground/70 mb-1">{category}</p>
                <h2 className="text-h1 text-foreground">{secretWord}</h2>
              </div>
            </GameCard>

            {/* Vote breakdown */}
            <div className="mb-6">
              <h3 className="text-h3 text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Vote Results
              </h3>
              <div className="space-y-2">
                {sortedByVotes.map((player) => (
                  <ListRowPill
                    key={player.id}
                    avatarColor={player.avatarColor}
                    name={player.name}
                    isHighlighted={player.id === mostVoted.id}
                    rightContent={
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold",
                          player.id === mostVoted.id ? "text-primary-foreground" : "text-foreground"
                        )}>
                          {player.voteCount} votes
                        </span>
                        {player.id === impostorId && (
                          <span className="text-caption">🎭</span>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {/* Score */}
            <GameCard color="white" className="p-4 mb-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-caption text-muted-foreground">Crew Wins</p>
                  <p className="text-h2 text-game-teal">{crewWins}</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="text-caption text-muted-foreground">Impostor Wins</p>
                  <p className="text-h2 text-destructive">{impostorWins}</p>
                </div>
              </div>
            </GameCard>

            {/* Actions */}
            <div className="space-y-3">
              <PillButton
                variant="primary"
                fullWidth
                icon={<RotateCcw className="w-5 h-5" />}
                iconPosition="left"
                onClick={onPlayAgain}
              >
                Play Again
              </PillButton>
              <PillButton
                variant="outline"
                fullWidth
                icon={<Home className="w-5 h-5" />}
                iconPosition="left"
                onClick={onBackToLobby}
              >
                Back to Lobby
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
