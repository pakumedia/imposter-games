import { ArrowLeft, Crown, Lock, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AppShell, ImpostorCounter } from '@/components/ui-kit';
import { 
  GameSettings, 
  getMaxImpostors, 
  FREE_CATEGORY_NAMES, 
  PRO_CATEGORY_NAMES 
} from '@/game/types';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SettingsScreenProps {
  settings: GameSettings;
  playerCount: number;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onBack: () => void;
}

const DISCUSSION_TIMES = [60, 120, 180, 240, 300];
const VOTING_TIMES = [30, 60, 90, 120];

// iOS-style Settings Group Component
function SettingsGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl overflow-hidden shadow-soft", className)}>
      {children}
    </div>
  );
}

// iOS-style Settings Row Component
function SettingsRow({ 
  children, 
  isLast = false,
  className 
}: { 
  children: ReactNode; 
  isLast?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(
      "py-4 px-5",
      !isLast && "border-b border-border",
      className
    )}>
      {children}
    </div>
  );
}

// Section Header Component
function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-8 mb-3 px-1">
      <span className="text-lg">{emoji}</span>
      <h2 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
    </div>
  );
}

// Category Row Component
function CategoryRow({ 
  name, 
  isSelected, 
  isPro = false, 
  isCustom = false,
  onToggle,
  isLast = false
}: { 
  name: string; 
  isSelected: boolean; 
  isPro?: boolean;
  isCustom?: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  const isLocked = isPro;
  
  return (
    <button
      onClick={!isLocked ? onToggle : undefined}
      disabled={isLocked}
      className={cn(
        "w-full py-4 px-5 flex items-center justify-between transition-all",
        !isLast && "border-b border-border",
        isLocked ? "opacity-60" : "tap-scale active:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        {isCustom && (
          <span className="text-sm bg-game-purple/20 text-game-purple px-2 py-0.5 rounded-full font-semibold">
            ✨
          </span>
        )}
        {isPro && !isCustom && (
          <span className="text-sm bg-[#FF6D1F]/10 text-[#FF6D1F] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <Crown className="w-3 h-3" />
          </span>
        )}
        <span className={cn(
          "font-medium text-body",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {name}
        </span>
      </div>
      
      {isLocked ? (
        <Lock className="w-4 h-4 text-muted-foreground" />
      ) : isSelected ? (
        <div className="w-6 h-6 rounded-full bg-[#FF6D1F] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
      )}
    </button>
  );
}

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
      <div className="flex-1 screen-padding py-6 pb-32 animate-fade-in overflow-y-auto bg-muted/30">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground mb-6 tap-scale"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-body font-medium">Zurück</span>
        </button>

        {/* Header */}
        <h1 className="text-h1 text-foreground mb-2">Einstellungen</h1>
        <p className="text-body text-muted-foreground mb-6">Passe dein Spiel an</p>

        {/* Impostor Count Section */}
        <SectionHeader emoji="🕵️" title="Impostors" />
        <SettingsGroup>
          <SettingsRow isLast>
            <p className="text-caption text-muted-foreground mb-4">
              Max {maxImpostors} für {playerCount} Spieler
            </p>
            <ImpostorCounter
              value={Math.min(settings.impostorCount, maxImpostors)}
              max={maxImpostors}
              onChange={(value) => onUpdateSettings({ impostorCount: value })}
            />
          </SettingsRow>
        </SettingsGroup>

        {/* Categories Section */}
        <SectionHeader emoji="📂" title="Kategorien" />
        <div className="flex items-center justify-end mb-3 px-1">
          <button 
            onClick={handleSelectAllFree}
            className="text-caption text-[#FF6D1F] font-semibold tap-scale"
          >
            Alle Free
          </button>
        </div>
        
        <SettingsGroup className="mb-4">
          {/* Custom Category */}
          <CategoryRow
            name="Custom Category"
            isSelected={false}
            isPro={true}
            isCustom={true}
            onToggle={() => {}}
            isLast
          />
        </SettingsGroup>

        {/* Free Categories */}
        <p className="text-caption text-muted-foreground mb-2 px-1 font-semibold uppercase tracking-wide">
          Free
        </p>
        <SettingsGroup className="mb-4">
          {FREE_CATEGORY_NAMES.map((category, index) => (
            <CategoryRow
              key={category}
              name={category}
              isSelected={settings.selectedCategories.includes(category)}
              onToggle={() => handleCategoryToggle(category)}
              isLast={index === FREE_CATEGORY_NAMES.length - 1}
            />
          ))}
        </SettingsGroup>

        {/* PRO Categories */}
        <p className="text-caption text-muted-foreground mb-2 px-1 font-semibold uppercase tracking-wide flex items-center gap-1">
          <Crown className="w-3 h-3 text-[#FF6D1F]" />
          Pro
        </p>
        <SettingsGroup>
          {PRO_CATEGORY_NAMES.map((category, index) => (
            <CategoryRow
              key={category}
              name={category}
              isSelected={false}
              isPro={true}
              onToggle={() => {}}
              isLast={index === PRO_CATEGORY_NAMES.length - 1}
            />
          ))}
        </SettingsGroup>

        {/* Impostor Helpers Section */}
        <SectionHeader emoji="💡" title="Impostor Hilfen" />
        <SettingsGroup>
          <SettingsRow>
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
          </SettingsRow>
          <SettingsRow isLast>
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
          </SettingsRow>
        </SettingsGroup>

        {/* Time Settings Section */}
        <SectionHeader emoji="⏱️" title="Zeiten" />
        <SettingsGroup>
          <SettingsRow>
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
                      ? "bg-[#FF6D1F] text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          </SettingsRow>
          <SettingsRow isLast>
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
                      ? "bg-[#FF6D1F] text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {formatVotingTime(time)}
                </button>
              ))}
            </div>
          </SettingsRow>
        </SettingsGroup>
      </div>
    </AppShell>
  );
}
