import { useState } from 'react';
import { Plus, X, Play, Users, ArrowLeft, HelpCircle, Settings } from 'lucide-react';
import { AppShell, GameCard, PillButton, ListRowPill, IconButton, HowToPlayDialog, GameSettingsSheet } from '@/components/ui-kit';
import { useGameStore } from '@/game/store';
import { getMaxImpostors } from '@/game/types';

interface LobbyScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

export function LobbyScreen({ onStart, onBack }: LobbyScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { players, addPlayer, removePlayer, settings, updateSettings } = useGameStore();

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
  const maxImpostors = getMaxImpostors(players.length);

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
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-h1 text-foreground leading-tight">
              Impostor<br />Secret Word
            </h1>
            <p className="text-body text-muted-foreground mt-2">
              Pass & Play • 3-10 Players
            </p>
          </div>
          <IconButton
            variant="ghost"
            size="lg"
            onClick={() => setShowSettings(true)}
            className="bg-secondary"
          >
            <Settings className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Active Settings Preview */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-caption font-semibold">
            {Math.min(settings.impostorCount, maxImpostors)} Impostor{settings.impostorCount > 1 ? 's' : ''}
          </span>
          {settings.showCategoryToImpostor && (
            <span className="px-3 py-1 rounded-full bg-game-blue/10 text-game-blue text-caption font-semibold">
              Category ON
            </span>
          )}
          {settings.showHintToImpostor && (
            <span className="px-3 py-1 rounded-full bg-game-orange/10 text-game-orange text-caption font-semibold">
              Hint ON
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-caption font-semibold">
            {settings.selectedCategories.length} categories
          </span>
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

        {/* How to Play Button */}
        <button 
          onClick={() => setShowHowToPlay(true)}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-game-orange/10 hover:bg-game-orange/20 text-game-orange rounded-2xl transition-colors tap-scale"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-bold">How to Play</span>
        </button>
      </div>

      {/* How to Play Dialog */}
      <HowToPlayDialog 
        open={showHowToPlay} 
        onOpenChange={setShowHowToPlay}
        gameMode="secret-word"
      />

      {/* Settings Sheet */}
      <GameSettingsSheet
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        playerCount={players.length || 3}
        onUpdateSettings={updateSettings}
      />
    </AppShell>
  );
}
