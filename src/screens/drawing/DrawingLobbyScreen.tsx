import { useState } from 'react';
import { Plus, X, Play, Users, ArrowLeft, Palette, Clock } from 'lucide-react';
import { AppShell, GameCard, PillButton, ListRowPill, IconButton } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';

interface DrawingLobbyScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

export function DrawingLobbyScreen({ onStart, onBack }: DrawingLobbyScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const { 
    players, 
    addPlayer, 
    removePlayer, 
    maxDrawingRounds, 
    drawingTimePerPlayer,
    setMaxRounds,
    setDrawingTime 
  } = useDrawingStore();

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

  const canStart = players.length >= 4;

  return (
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in overflow-y-auto">
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
            Impostor<br />Drawing
          </h1>
          <p className="text-body text-muted-foreground mt-2">
            Fake Artist • 4-8 Players
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
              className="flex-1 h-12 px-4 rounded-pill bg-secondary text-foreground placeholder:text-muted-foreground text-body-sm font-medium outline-none focus:ring-2 focus:ring-game-blue/30"
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

        {/* Settings */}
        <GameCard color="blue" className="p-4 mb-5">
          <h3 className="font-bold text-body text-foreground mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Game Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-foreground/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time per turn
              </span>
              <div className="flex items-center gap-2">
                {[8, 10, 15].map((time) => (
                  <button
                    key={time}
                    onClick={() => setDrawingTime(time)}
                    className={`px-3 py-1 rounded-pill text-caption font-bold transition-all ${
                      drawingTimePerPlayer === time
                        ? 'bg-foreground text-card'
                        : 'bg-card/50 text-foreground/70'
                    }`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-foreground/80">
                Drawing rounds
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((rounds) => (
                  <button
                    key={rounds}
                    onClick={() => setMaxRounds(rounds)}
                    className={`px-3 py-1 rounded-pill text-caption font-bold transition-all ${
                      maxDrawingRounds === rounds
                        ? 'bg-foreground text-card'
                        : 'bg-card/50 text-foreground/70'
                    }`}
                  >
                    {rounds}x
                  </button>
                ))}
              </div>
            </div>
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
              {players.length}/8
            </span>
          </div>

          <div className="space-y-3">
            {players.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-body">
                Add at least 4 players to start
              </div>
            ) : (
              players.map((player, index) => (
                <ListRowPill
                  key={player.id}
                  avatarColor={player.avatarColor}
                  name={player.name}
                  subtitle={`Player ${index + 1}`}
                  rightContent={
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: player.drawingColor }}
                      />
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(player.id)}
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </IconButton>
                    </div>
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
            {canStart ? 'Start Game' : `Need ${4 - players.length} more players`}
          </PillButton>
        </div>

        {/* Rules hint */}
        <GameCard color="orange" className="mt-6 p-4">
          <h3 className="font-bold text-body text-foreground mb-2">🎨 How to Play</h3>
          <ul className="text-caption text-foreground/80 space-y-1">
            <li>• Everyone draws the same thing except the Fake Artist</li>
            <li>• Each player adds ONE line to the drawing</li>
            <li>• The Fake Artist must blend in without knowing the word!</li>
            <li>• Vote to find the Fake Artist!</li>
          </ul>
        </GameCard>
      </div>
    </AppShell>
  );
}
