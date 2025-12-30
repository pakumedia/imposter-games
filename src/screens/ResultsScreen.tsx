import { useEffect, useState, useCallback } from 'react';
import { AppShell, GameCard, PillButton, ListRowPill, Sparkles } from '@/components/ui-kit';
import { Mascot, ImpostorMascot } from '@/components/mascots';
import { RotateCcw, Home, Users, Eye } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { cn } from '@/lib/utils';

interface ResultsScreenProps {
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  onEndGame: () => void;
}

export function ResultsScreen({ onPlayAgain, onBackToLobby, onEndGame }: ResultsScreenProps) {
  const { players, impostorIds, secretWord, category, votes } = useGameStore();
  const [showResult, setShowResult] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const impostors = players.filter(p => impostorIds.includes(p.id));
  
  // Calculate who got most votes
  const voteCounts = players.map(p => ({
    ...p,
    voteCount: Object.values(votes).filter(v => v === p.id).length
  }));
  const sortedByVotes = [...voteCounts].sort((a, b) => b.voteCount - a.voteCount);
  const mostVoted = sortedByVotes[0];
  const impostorCaught = impostorIds.includes(mostVoted.id);

  useEffect(() => {
    // Dramatic reveal delay
    const timer = setTimeout(() => setShowResult(true), 1500);
    return () => clearTimeout(timer);
  }, []);

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

            {/* The Impostor(s) reveal - tap to show */}
            <GameCard 
              color="dark" 
              className={cn(
                "p-6 mb-6 cursor-pointer transition-all",
                isShaking && "animate-shake"
              )}
              onClick={handleReveal}
            >
              {!isRevealed ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-3">
                    <Eye className="w-7 h-7 text-primary-foreground/60" />
                  </div>
                  <p className="text-body text-primary-foreground/60 font-medium">
                    Tippe zum Enthüllen
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 animate-scale-in">
                  <ImpostorMascot size="sm" />
                  <div>
                    <p className="text-caption text-primary-foreground/60">
                      {impostors.length > 1 ? 'The Impostors were' : 'The Impostor was'}
                    </p>
                    <h2 className="text-h2 text-primary-foreground">
                      {impostors.map(p => p.name).join(' & ')}
                    </h2>
                  </div>
                </div>
              )}
            </GameCard>

            {/* The secret word - tap to show */}
            <GameCard 
              color="yellow" 
              className={cn(
                "p-5 mb-6 cursor-pointer transition-all",
                isShaking && "animate-shake"
              )}
              onClick={handleReveal}
            >
              {!isRevealed ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <p className="text-body text-foreground/60 font-medium">
                    Tippe zum Enthüllen
                  </p>
                </div>
              ) : (
                <div className="text-center animate-scale-in">
                  <p className="text-caption text-foreground/70 mb-1">{category}</p>
                  <h2 className="text-h1 text-foreground">{secretWord}</h2>
                </div>
              )}
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
                        {impostorIds.includes(player.id) && isRevealed && (
                          <span className="text-caption">🎭</span>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

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
              <button 
                onClick={onEndGame}
                className="w-full flex items-center justify-center gap-2 py-4 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-2xl transition-colors tap-scale"
              >
                <span className="font-bold">Spiel beenden</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
