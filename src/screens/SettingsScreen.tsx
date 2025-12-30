import { ArrowLeft, Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AppShell, ImpostorCounter, CategoryCard } from '@/components/ui-kit';
import { 
  GameSettings, 
  getMaxImpostors, 
  FREE_CATEGORY_NAMES, 
  PRO_CATEGORY_NAMES 
} from '@/game/types';
import { cn } from '@/lib/utils';

interface SettingsScreenProps {
  settings: GameSettings;
  playerCount: number;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onBack: () => void;
}

const DISCUSSION_TIMES = [60, 120, 180, 240, 300];
const VOTING_TIMES = [30, 60, 90, 120];

export function SettingsScreen({
  settings,
  playerCount,
  onUpdateSettings,
  onBack,
}: SettingsScreenProps) {
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
    <AppShell>
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in overflow-y-auto">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground mb-6 tap-scale"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-body font-medium">Back</span>
        </button>

        {/* Header */}
        <h1 className="text-h1 text-foreground mb-8">⚙️ Einstellungen</h1>

        {/* Impostor Count */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🕵️</span>
            <h2 className="text-h3 text-foreground">Impostors</h2>
          </div>
          <p className="text-body text-muted-foreground mb-4">
            Max {maxImpostors} für {playerCount} Spieler
          </p>
          <ImpostorCounter
            value={Math.min(settings.impostorCount, maxImpostors)}
            max={maxImpostors}
            onChange={(value) => onUpdateSettings({ impostorCount: value })}
          />
        </section>

        <div className="h-px bg-border mb-8" />

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📂</span>
              <h2 className="text-h3 text-foreground">Kategorien</h2>
            </div>
            <button 
              onClick={handleSelectAllFree}
              className="text-caption text-game-teal font-semibold"
            >
              Alle Free
            </button>
          </div>
          
          {/* Custom Category */}
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
          <p className="text-caption text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
            Free
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
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
          <p className="text-caption text-muted-foreground mb-3 font-semibold uppercase tracking-wide flex items-center gap-1">
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
        </section>

        <div className="h-px bg-border mb-8" />

        {/* Impostor Helpers */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-h3 text-foreground">Impostor Hilfen</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">👁️</span>
                <p className="font-medium text-body text-foreground">Kategorie zeigen</p>
              </div>
              <Switch
                checked={settings.showCategoryToImpostor}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ showCategoryToImpostor: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <p className="font-medium text-body text-foreground">Hinweis zeigen</p>
              </div>
              <Switch
                checked={settings.showHintToImpostor}
                onCheckedChange={(checked) => 
                  onUpdateSettings({ showHintToImpostor: checked })
                }
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-border mb-8" />

        {/* Time Settings */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⏱️</span>
            <h2 className="text-h3 text-foreground">Zeit Einstellungen</h2>
          </div>
          
          {/* Discussion Time */}
          <div className="mb-5">
            <p className="text-body text-muted-foreground mb-3 flex items-center gap-2">
              <span>💬</span> Diskussion
            </p>
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
            <p className="text-body text-muted-foreground mb-3 flex items-center gap-2">
              <span>🗳️</span> Abstimmung
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
        </section>
      </div>
    </AppShell>
  );
}
