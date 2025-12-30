import { Switch } from '@/components/ui/switch';
import { Users, Eye, Lightbulb, Clock, Vote, Layers, Crown, Lock } from 'lucide-react';
import { GameCard } from './GameCard';
import { ImpostorCounter } from './ImpostorCounter';
import { CategoryCard } from './CategoryCard';
import { 
  GameSettings, 
  getMaxImpostors, 
  FREE_CATEGORY_NAMES, 
  PRO_CATEGORY_NAMES 
} from '@/game/types';
import { cn } from '@/lib/utils';

interface InlineGameSettingsProps {
  settings: GameSettings;
  playerCount: number;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

const DISCUSSION_TIMES = [60, 120, 180, 240, 300];
const VOTING_TIMES = [30, 60, 90, 120];

export function InlineGameSettings({
  settings,
  playerCount,
  onUpdateSettings,
}: InlineGameSettingsProps) {
  const maxImpostors = getMaxImpostors(playerCount);

  const handleCategoryToggle = (category: string) => {
    const current = settings.selectedCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    if (updated.length > 0) {
      onUpdateSettings({ selectedCategories: updated });
    }
  };

  const handleSelectAllFree = () => {
    onUpdateSettings({ selectedCategories: [...FREE_CATEGORY_NAMES] });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins === 1 ? '1 min' : `${mins} min`;
  };

  const formatVotingTime = (seconds: number) => {
    return seconds < 60 ? `${seconds}s` : `${seconds / 60} min`;
  };

  return (
    <div className="space-y-4">
      {/* Impostor Count */}
      <GameCard color="subtle" className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-body-sm text-foreground">Impostors</h3>
            <p className="text-caption text-muted-foreground">
              Max {maxImpostors} for {playerCount} players
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <ImpostorCounter
            value={Math.min(settings.impostorCount, maxImpostors)}
            max={maxImpostors}
            onChange={(value) => onUpdateSettings({ impostorCount: value })}
          />
        </div>
      </GameCard>

      {/* Categories */}
      <GameCard color="subtle" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-body-sm text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-game-purple" />
            Categories
          </h3>
          <button 
            onClick={handleSelectAllFree}
            className="text-caption text-game-teal font-semibold"
          >
            All Free
          </button>
        </div>
        
        {/* Custom Category (PRO) */}
        <div className="mb-3">
          <CategoryCard
            name="Custom Category"
            isSelected={false}
            isPro={true}
            isCustom={true}
            onToggle={() => {}}
          />
        </div>

        {/* Free Categories */}
        <p className="text-caption text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
          Free
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {FREE_CATEGORY_NAMES.map((category) => (
            <CategoryCard
              key={category}
              name={category}
              isSelected={settings.selectedCategories.includes(category)}
              onToggle={() => handleCategoryToggle(category)}
              compact
            />
          ))}
        </div>

        {/* PRO Categories */}
        <p className="text-caption text-muted-foreground mb-2 font-semibold uppercase tracking-wide flex items-center gap-1">
          <Crown className="w-3 h-3 text-game-yellow" />
          Pro
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PRO_CATEGORY_NAMES.map((category) => (
            <CategoryCard
              key={category}
              name={category}
              isSelected={false}
              isPro={true}
              onToggle={() => {}}
              compact
            />
          ))}
        </div>
      </GameCard>

      {/* Impostor Helpers */}
      <GameCard color="subtle" className="p-4">
        <h3 className="font-bold text-body-sm text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-game-yellow" />
          Impostor Helpers
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-game-blue" />
              <div>
                <p className="font-medium text-body-sm text-foreground">Show Category</p>
              </div>
            </div>
            <Switch
              checked={settings.showCategoryToImpostor}
              onCheckedChange={(checked) => 
                onUpdateSettings({ showCategoryToImpostor: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-game-orange" />
              <div>
                <p className="font-medium text-body-sm text-foreground">Show Hint</p>
              </div>
            </div>
            <Switch
              checked={settings.showHintToImpostor}
              onCheckedChange={(checked) => 
                onUpdateSettings({ showHintToImpostor: checked })
              }
            />
          </div>
        </div>
      </GameCard>

      {/* Time Settings */}
      <GameCard color="subtle" className="p-4">
        <h3 className="font-bold text-body-sm text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-game-teal" />
          Time Settings
        </h3>
        
        {/* Discussion Time */}
        <div className="mb-3">
          <p className="text-caption text-muted-foreground mb-2">Discussion</p>
          <div className="flex gap-1.5 flex-wrap">
            {DISCUSSION_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => onUpdateSettings({ discussionTimeSeconds: time })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-caption font-semibold transition-all tap-scale",
                  settings.discussionTimeSeconds === time
                    ? "bg-game-teal text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>

        {/* Voting Time */}
        <div>
          <p className="text-caption text-muted-foreground mb-2 flex items-center gap-1">
            <Vote className="w-3 h-3" />
            Voting
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {VOTING_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => onUpdateSettings({ votingTimeSeconds: time })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-caption font-semibold transition-all tap-scale",
                  settings.votingTimeSeconds === time
                    ? "bg-game-teal text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {formatVotingTime(time)}
              </button>
            ))}
          </div>
        </div>
      </GameCard>
    </div>
  );
}
