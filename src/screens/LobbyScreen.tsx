import { useState } from 'react';
import { Plus, X, Play, Users, ArrowLeft, HelpCircle, Settings } from 'lucide-react';
import { AppShell, GameCard, PillButton, ListRowPill, IconButton, HowToPlayDialog } from '@/components/ui-kit';
import { useGameStore } from '@/game/store';
import { SettingsScreen } from './SettingsScreen';

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

  // Show Settings Screen
  if (showSettings) {
    return (
      <SettingsScreen
        settings={settings}
        playerCount={players.length || 3}
        onUpdateSettings={updateSettings}
        onBack={() => setShowSettings(false)}
      />
    );
  }

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
        <div className="mb-6">
          <h1 className="text-h1 text-foreground leading-tight">
            Impostor<br />Secret Word
          </h1>
          <p className="text-body text-muted-foreground mt-2">
            Pass & Play • 3-10 Players
          </p>
        </div>

        {/* Add player input */}
        <GameCard color="subtle" className="p-4 mb-5 bg-[#FF6D1F]">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player name..."
              className="flex-1 h-12 px-4 rounded-pill bg-white/20 text-white placeholder:text-white/70 text-body-sm font-medium outline-none focus:ring-2 focus:ring-white/30"
              maxLength={20}
            />
            <button
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim()}
              className="w-12 h-12 rounded-full bg-white hover:bg-white/90 flex items-center justify-center flex-shrink-0 transition-all tap-scale disabled:opacity-50"
            >
              <Plus className="w-6 h-6 text-[#FF6D1F]" />
            </button>
          </div>
        </GameCard>

        {/* Players list */}
        <div className="mb-6">
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

        {/* Settings Button */}
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-colors tap-scale"
        >
          <Settings className="w-5 h-5" />
          <span className="font-bold">Einstellungen</span>
        </button>

        {/* Start button */}
        <div className="mt-4">
          <PillButton
            variant="orange"
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
    </AppShell>
  );
}
