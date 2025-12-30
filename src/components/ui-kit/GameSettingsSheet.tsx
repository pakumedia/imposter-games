import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Users, Eye, Lightbulb, Clock, Vote, Layers } from 'lucide-react';
import { GameCard, PillButton } from '@/components/ui-kit';
import { ImpostorCounter } from './ImpostorCounter';
import { CategoryCard } from './CategoryCard';
import { 
  GameSettings, 
  getMaxImpostors, 
  FREE_CATEGORY_NAMES, 
  PRO_CATEGORY_NAMES 
} from '@/game/types';
import { cn } from '@/lib/utils';

interface GameSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: GameSettings;
  playerCount: number;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

const DISCUSSION_TIMES = [60, 120, 180, 240, 300]; // 1-5 minutes
const VOTING_TIMES = [30, 60, 90, 120];

export function GameSettingsSheet({
  open,
  onOpenChange,
  settings,
  playerCount,
  onUpdateSettings,
}: GameSettingsSheetProps) {
  const maxImpostors = getMaxImpostors(playerCount);

  const handleCategoryToggle = (category: string) => {
    const current = settings.selectedCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    // Ensure at least one category is selected
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-h2 text-foreground">Game Settings</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-80px)] pb-20 space-y-6">
          {/* Impostor Count */}
          <GameCard color="white" className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-body text-foreground">Number of Impostors</h3>
                <p className="text-caption text-muted-foreground">
                  Based on {playerCount} players
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

          {/* Impostor Helpers */}
          <GameCard color="white" className="p-5">
            <h3 className="font-bold text-body text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-game-yellow" />
              Impostor Helpers
            </h3>
            
            <div className="space-y-4">
              {/* Show Category Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-game-blue" />
                  <div>
                    <p className="font-medium text-body text-foreground">Show Category</p>
                    <p className="text-caption text-muted-foreground">
                      Impostor sees the word category
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.showCategoryToImpostor}
                  onCheckedChange={(checked) => 
                    onUpdateSettings({ showCategoryToImpostor: checked })
                  }
                />
              </div>

              {/* Show Hint Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-game-orange" />
                  <div>
                    <p className="font-medium text-body text-foreground">Show Hint</p>
                    <p className="text-caption text-muted-foreground">
                      Impostor gets a subtle hint word
                    </p>
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

          {/* Categories */}
          <GameCard color="white" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-body text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-game-purple" />
                Word Categories
              </h3>
              <button 
                onClick={handleSelectAllFree}
                className="text-caption text-game-teal font-semibold"
              >
                Select All Free
              </button>
            </div>
            
            {/* Custom Category (PRO - Featured) */}
            <div className="mb-4">
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
              Free Categories
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FREE_CATEGORY_NAMES.map((category) => (
                <CategoryCard
                  key={category}
                  name={category}
                  isSelected={settings.selectedCategories.includes(category)}
                  onToggle={() => handleCategoryToggle(category)}
                />
              ))}
            </div>

            {/* PRO Categories */}
            <p className="text-caption text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
              Pro Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRO_CATEGORY_NAMES.map((category) => (
                <CategoryCard
                  key={category}
                  name={category}
                  isSelected={false}
                  isPro={true}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </GameCard>

          {/* Time Settings */}
          <GameCard color="white" className="p-5">
            <h3 className="font-bold text-body text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-game-teal" />
              Time Settings
            </h3>
            
            {/* Discussion Time */}
            <div className="mb-4">
              <p className="text-body-sm text-muted-foreground mb-2">Discussion Time</p>
              <div className="flex gap-2 flex-wrap">
                {DISCUSSION_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => onUpdateSettings({ discussionTimeSeconds: time })}
                    className={cn(
                      "px-4 py-2 rounded-full text-body-sm font-semibold transition-all tap-scale",
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
              <p className="text-body-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Vote className="w-4 h-4" />
                Voting Time
              </p>
              <div className="flex gap-2 flex-wrap">
                {VOTING_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => onUpdateSettings({ votingTimeSeconds: time })}
                    className={cn(
                      "px-4 py-2 rounded-full text-body-sm font-semibold transition-all tap-scale",
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

        {/* Done button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <PillButton
            variant="primary"
            fullWidth
            onClick={() => onOpenChange(false)}
          >
            Done
          </PillButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
