import { useState } from 'react';
import { Plus, X, Play, Users, ArrowLeft, Settings, HelpCircle } from 'lucide-react';
import { AppShell, PillButton, ListRowPill, IconButton, HowToPlayDialog } from '@/components/ui-kit';
import { useDrawingStore } from '@/game/drawing-store';
import { DrawingSettingsScreen } from './DrawingSettingsScreen';
import { DRAWING_WORD_CATEGORIES } from '@/game/drawing-types';

interface DrawingLobbyScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

export function DrawingLobbyScreen({ onStart, onBack }: DrawingLobbyScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(Object.keys(DRAWING_WORD_CATEGORIES));
  const [showCategoryToImpostor, setShowCategoryToImpostor] = useState(true);
  
  const { 
    players, 
    addPlayer, 
    removePlayer, 
    maxDrawingRounds, 
    drawingTimePerPlayer,
    discussionTimeSeconds,
    votingTimeSeconds,
    gameMode,
    setMaxRounds,
    setDrawingTime,
    setGameMode,
    setShowCategoryToImpostor: setStoreShowCategory,
    setDiscussionTime,
    setVotingTime,
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

  const handleUpdateSettings = (newSettings: {
    gameMode?: 'simple' | 'guided';
    drawingTimePerPlayer?: number;
    maxDrawingRounds?: number;
    discussionTimeSeconds?: number;
    votingTimeSeconds?: number;
    showCategoryToImpostor?: boolean;
    selectedCategories?: string[];
  }) => {
    if (newSettings.gameMode !== undefined) {
      setGameMode(newSettings.gameMode);
    }
    if (newSettings.drawingTimePerPlayer !== undefined) {
      setDrawingTime(newSettings.drawingTimePerPlayer);
    }
    if (newSettings.maxDrawingRounds !== undefined) {
      setMaxRounds(newSettings.maxDrawingRounds);
    }
    if (newSettings.discussionTimeSeconds !== undefined) {
      setDiscussionTime(newSettings.discussionTimeSeconds);
    }
    if (newSettings.votingTimeSeconds !== undefined) {
      setVotingTime(newSettings.votingTimeSeconds);
    }
    if (newSettings.showCategoryToImpostor !== undefined) {
      setShowCategoryToImpostor(newSettings.showCategoryToImpostor);
      setStoreShowCategory(newSettings.showCategoryToImpostor);
    }
    if (newSettings.selectedCategories !== undefined) {
      setSelectedCategories(newSettings.selectedCategories);
    }
  };

  const canStart = players.length >= 4;

  // Show settings screen if open
  if (showSettings) {
    return (
      <DrawingSettingsScreen
        settings={{
          gameMode,
          drawingTimePerPlayer,
          maxDrawingRounds,
          discussionTimeSeconds,
          votingTimeSeconds,
          showCategoryToImpostor,
          selectedCategories,
        }}
        playerCount={players.length}
        onUpdateSettings={handleUpdateSettings}
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
        <div className="mb-8">
          <h1 className="text-h1 text-foreground leading-tight">
            Impostor<br />Drawing
          </h1>
          <p className="text-body text-muted-foreground mt-2">
            Fake Artist • 4-8 Players
          </p>
        </div>

        {/* Add player input */}
        <div className="bg-[#0046FF] rounded-2xl p-4 mb-5 shadow-soft">
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
              <Plus className="w-6 h-6 text-[#0046FF]" />
            </button>
          </div>
        </div>

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
        <div className="mt-4">
          <PillButton
            variant="primary"
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={onStart}
            disabled={!canStart}
            className="!bg-[#0046FF] hover:!bg-[#0035CC]"
          >
            {canStart ? 'Start Game' : `Need ${4 - players.length} more players`}
          </PillButton>
        </div>

        {/* Settings Button - below start button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-colors tap-scale"
        >
          <Settings className="w-5 h-5" />
          <span className="font-bold">Einstellungen</span>
        </button>

        {/* How to Play Button - text only */}
        <button 
          onClick={() => setShowHowToPlay(true)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors tap-scale"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">How to Play</span>
        </button>
      </div>

      {/* How to Play Dialog */}
      <HowToPlayDialog 
        open={showHowToPlay} 
        onOpenChange={setShowHowToPlay}
        gameMode="drawing"
      />
    </AppShell>
  );
}
