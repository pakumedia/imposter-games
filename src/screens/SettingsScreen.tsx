import { ArrowLeft, Lock } from 'lucide-react';
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

// Category emoji mapping
const CATEGORY_EMOJIS: Record<string, string> = {
  // Free
  'Animals': '🐾',
  'Food': '🍕',
  'Objects': '🪑',
  'Electronics': '📱',
  // Pro
  'Brands': '👟',
  'Movies': '🎬',
  'Vehicles': '🚗',
  'Superpowers': '⚡',
  'Fears': '😱',
  'Inventions': '💡',
  'Celebrities': '⭐',
  'Games': '🎮',
  'Anime': '🎌',
  'Countries': '🌍',
  'Custom Category': '✨',
};

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

// Card Header Component (inside card)
function CardHeader({ emoji, title, rightContent, className }: { emoji: string; title: string; rightContent?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between py-3.5 px-4 border-b border-border", className)}>
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{emoji}</span>
        <h2 className="text-body font-bold text-foreground">
          {title}
        </h2>
      </div>
      {rightContent}
    </div>
  );
}

// Category Row Component (iOS-style full width row)
function CategoryRow({ 
  name, 
  isSelected, 
  isPro = false, 
  onToggle,
  isLast = false,
}: { 
  name: string; 
  isSelected: boolean; 
  isPro?: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  const isLocked = isPro;
  const emoji = CATEGORY_EMOJIS[name] || '📁';
  
  return (
    <button
      onClick={!isLocked ? onToggle : undefined}
      disabled={isLocked}
      className={cn(
        "flex items-center gap-3 py-3.5 px-4 w-full transition-all text-left",
        !isLast && "border-b border-border",
        isLocked && "opacity-60",
        isSelected && "bg-[#FF6D1F]/10"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
        isSelected ? "bg-[#FF6D1F]/20" : "bg-muted"
      )}>
        {emoji}
      </div>
      <span className={cn(
        "font-medium text-body flex-1",
        isLocked ? "text-muted-foreground" : "text-foreground"
      )}>
        {name}
      </span>
      {isLocked ? (
        <Lock className="w-4 h-4 text-muted-foreground" />
      ) : isSelected ? (
        <div className="w-5 h-5 rounded-full bg-[#FF6D1F]" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
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
        <p className="text-body text-muted-foreground mb-4">Passe dein Spiel an</p>

        {/* Impostor Count Section */}
        <SettingsGroup className="mt-6">
          <CardHeader emoji="🕵️" title="Impostors" />
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

        {/* Free Categories */}
        <SettingsGroup className="mt-6">
          <CardHeader 
            emoji="📂" 
            title="Kategorien (Free)" 
            rightContent={
              <button 
                onClick={handleSelectAllFree}
                className="text-caption text-[#FF6D1F] font-semibold tap-scale"
              >
                Alle auswählen
              </button>
            }
          />
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
        <SettingsGroup className="mt-6">
          <CardHeader 
            emoji="👑" 
            title="Kategorien (Pro)" 
            rightContent={
              <span className="text-caption text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Premium
              </span>
            }
          />
          <CategoryRow
            name="Custom Category"
            isSelected={false}
            isPro={true}
            onToggle={() => {}}
          />
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
        <SettingsGroup className="mt-6">
          <CardHeader emoji="💡" title="Impostor Hilfen" />
          <SettingsRow>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">👁️</span>
                <div>
                  <p className="font-medium text-body text-foreground">Kategorie zeigen</p>
                  <p className="text-caption text-muted-foreground">Impostor sieht die aktive Kategorie</p>
                </div>
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
                <div>
                  <p className="font-medium text-body text-foreground">Hinweis zeigen</p>
                  <p className="text-caption text-muted-foreground">Impostor bekommt einen hilfreichen Tipp</p>
                </div>
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
        <SettingsGroup className="mt-6">
          <CardHeader emoji="⏱️" title="Zeiten" />
          <SettingsRow>
            <div className="mb-3">
              <p className="font-medium text-body text-foreground flex items-center gap-2">
                <span>💬</span> Diskussion
              </p>
              <p className="text-caption text-muted-foreground ml-7">Zeit zum Diskutieren</p>
            </div>
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
            <div className="mb-3">
              <p className="font-medium text-body text-foreground flex items-center gap-2">
                <span>🗳️</span> Abstimmung
              </p>
              <p className="text-caption text-muted-foreground ml-7">Zeit zum Abstimmen</p>
            </div>
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
