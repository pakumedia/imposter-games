import { useState } from 'react';
import { Plus, X, Play, Users, ArrowLeft } from 'lucide-react';
import { AppShell, GameCard, PillButton, ListRowPill, IconButton } from '@/components/ui-kit';
import { useGameStore } from '@/game/store';

interface LobbyScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

export function LobbyScreen({ onStart, onBack }: LobbyScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const { players, addPlayer, removePlayer } = useGameStore();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const canStart = players.length >= 3;

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in">
        {/* Back button */}
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground mb-4 tap-scale"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-body font-medium">Back to Games</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-foreground leading-tight">
            Impostor<br />Secret Word
          </h1>
          <p className="text-body text-muted-foreground mt-2">
            Pass & Play • 3-10 Players
          </p>
        </div>

        {/* Add player input */}
        <GameCard color="white" className="p-5 mb-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player name..."
              className="flex-1 h-12 px-4 rounded-pill bg-secondary text-foreground placeholder:text-muted-foreground text-body-sm font-medium outline-none focus:ring-2 focus:ring-primary/30"
              maxLength={20}
            />
            <IconButton
              variant="teal"
              size="lg"
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim()}
            >
              <Plus className="w-5 h-5" />
            </IconButton>
          </div>
        </GameCard>

        {/* Players list */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players
            </h2>
            <span className="text-caption text-muted-foreground">
              {players.length}/10
            </span>
          </div>

          <div className="space-y-3">
            {players.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-body">
                Add at least 3 players to start
              </div>
            ) : (
              players.map((player, index) => (
                <ListRowPill
                  key={player.id}
                  avatarColor={player.avatarColor}
                  name={player.name}
                  subtitle={`Player ${index + 1}`}
                  rightContent={
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </IconButton>
                  }
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))
            )}
          </div>
        </div>

        {/* Start button */}
        <div className="mt-8">
          <PillButton
            variant="primary"
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={onStart}
            disabled={!canStart}
          >
            {canStart ? 'Start Game' : `Need ${3 - players.length} more players`}
          </PillButton>
        </div>

        {/* Rules hint */}
        <GameCard color="yellow" className="mt-6 p-4">
          <h3 className="font-bold text-body text-foreground mb-2">🎭 How to Play</h3>
          <ul className="text-caption text-foreground/80 space-y-1">
            <li>• Everyone gets the same secret word except the Impostor</li>
            <li>• Take turns giving 1-word hints</li>
            <li>• Vote to find the Impostor!</li>
          </ul>
        </GameCard>
      </div>
    </AppShell>
  );
}
