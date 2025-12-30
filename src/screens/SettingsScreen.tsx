import { ArrowLeft, Lock, Check, X, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AppShell, ImpostorCounter } from '@/components/ui-kit';
import { 
  GameSettings, 
  getMaxImpostors, 
  FREE_CATEGORY_NAMES, 
  PRO_CATEGORY_NAMES 
} from '@/game/types';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';

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

// Pricing plans
const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monatlich',
    price: '2,99€',
    period: '/Monat',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Jährlich',
    price: '19,99€',
    period: '/Jahr',
    popular: true,
    savings: 'Spare 44%',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '39,99€',
    period: 'einmalig',
    popular: false,
  },
];

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

// Card Header Component with accent highlight
function CardHeader({ emoji, title, rightContent, className }: { emoji: string; title: string; rightContent?: ReactNode; className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 px-5 bg-gradient-to-r from-[#FF6D1F]/10 to-[#FF6D1F]/5 border-b border-[#FF6D1F]/20",
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-lg font-bold text-foreground">
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
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 py-3.5 px-5 w-full transition-all text-left tap-scale",
        !isLast && "border-b border-border",
        isPro && "bg-gradient-to-r from-amber-50/50 to-transparent",
        isSelected && !isPro && "bg-[#FF6D1F]/10"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center text-lg",
        isPro 
          ? "bg-gradient-to-br from-amber-100 to-amber-200/50 border border-amber-300/30"
          : isSelected 
            ? "bg-[#FF6D1F]/20" 
            : "bg-muted"
      )}>
        {emoji}
      </div>
      <span className={cn(
        "font-medium text-body flex-1",
        isPro ? "text-amber-800/60" : "text-foreground"
      )}>
        {name}
      </span>
      {isLocked ? (
        <Lock className="w-5 h-5 text-amber-600/50" />
      ) : isSelected ? (
        <div className="w-6 h-6 rounded-full bg-[#FF6D1F] flex items-center justify-center">
          <Check className="w-4 h-4 text-white stroke-[3]" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
      )}
    </button>
  );
}

// Premium Divider Component
function PremiumDivider() {
  return (
    <div className="relative py-3 px-5 bg-gradient-to-r from-amber-500/10 via-yellow-400/15 to-amber-500/10 border-y border-amber-300/30">
      <div className="flex items-center gap-2">
        <span className="text-lg">👑</span>
        <span className="font-bold text-amber-700 text-sm">PRO Kategorien</span>
      </div>
    </div>
  );
}

// Paywall Dialog Component
function PaywallDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-gradient-to-b from-white to-amber-50/30 border-0 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="relative pt-8 pb-6 px-6 text-center bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center tap-scale"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Werde Premium</h2>
          <p className="text-white/80 text-sm">Schalte alle Features frei</p>
        </div>

        {/* Features */}
        <div className="px-6 py-5 border-b border-border">
          <div className="space-y-3">
            {[
              '10+ Premium Kategorien',
              'Eigene Kategorien erstellen',
              'Keine Werbung',
              'Früher Zugang zu neuen Features',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        <div className="px-6 py-5 space-y-3">
          {PRICING_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all relative tap-scale",
                selectedPlan === plan.id
                  ? "border-amber-500 bg-amber-50/50"
                  : "border-border bg-card hover:border-amber-300"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                  Beliebt
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold text-foreground">{plan.name}</p>
                  {plan.savings && (
                    <p className="text-xs text-amber-600 font-medium">{plan.savings}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              
              {/* Selection indicator */}
              <div className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                selectedPlan === plan.id
                  ? "border-amber-500 bg-amber-500"
                  : "border-muted-foreground/30"
              )}>
                {selectedPlan === plan.id && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="px-6 pb-6">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all tap-scale">
            Jetzt freischalten
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Jederzeit kündbar • Sichere Bezahlung
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Time Selector Component
function TimeSelector({ 
  times, 
  selectedTime, 
  onSelect, 
  formatTime 
}: { 
  times: number[]; 
  selectedTime: number; 
  onSelect: (time: number) => void;
  formatTime: (time: number) => string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {times.map((time) => {
        const isSelected = selectedTime === time;
        return (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={cn(
              "relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all tap-scale flex-shrink-0",
              "border-2",
              isSelected
                ? "bg-gradient-to-br from-[#FF6D1F] to-[#FF8A47] text-white border-transparent shadow-lg shadow-[#FF6D1F]/25"
                : "bg-card text-foreground border-border hover:border-[#FF6D1F]/30 hover:bg-[#FF6D1F]/5"
            )}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsScreen({
  settings,
  playerCount,
  onUpdateSettings,
  onBack,
}: SettingsScreenProps) {
  const maxImpostors = getMaxImpostors(playerCount);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const current = settings.selectedCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    if (updated.length > 0) {
      onUpdateSettings({ selectedCategories: updated });
    }
  };

  const handleProCategoryClick = () => {
    setShowPaywall(true);
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

        {/* All Categories (Free + Pro) in one card */}
        <SettingsGroup className="mt-6">
          <CardHeader 
            emoji="📂" 
            title="Kategorien" 
            rightContent={
              <button 
                onClick={handleSelectAllFree}
                className="text-caption text-[#FF6D1F] font-semibold tap-scale"
              >
                Alle auswählen
              </button>
            }
          />
          
          {/* Free Categories */}
          {FREE_CATEGORY_NAMES.map((category) => (
            <CategoryRow
              key={category}
              name={category}
              isSelected={settings.selectedCategories.includes(category)}
              onToggle={() => handleCategoryToggle(category)}
            />
          ))}
          
          {/* Premium Divider */}
          <PremiumDivider />
          
          {/* Pro Categories (locked) */}
          <CategoryRow
            name="Custom Category"
            isSelected={false}
            isPro={true}
            onToggle={handleProCategoryClick}
          />
          {PRO_CATEGORY_NAMES.map((category, index) => (
            <CategoryRow
              key={category}
              name={category}
              isSelected={false}
              isPro={true}
              onToggle={handleProCategoryClick}
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
            <div className="mb-4">
              <p className="font-medium text-body text-foreground flex items-center gap-2">
                <span>💬</span> Diskussion
              </p>
              <p className="text-caption text-muted-foreground ml-7">Zeit zum Diskutieren</p>
            </div>
            <TimeSelector
              times={DISCUSSION_TIMES}
              selectedTime={settings.discussionTimeSeconds}
              onSelect={(time) => onUpdateSettings({ discussionTimeSeconds: time })}
              formatTime={formatTime}
            />
          </SettingsRow>
          <SettingsRow isLast>
            <div className="mb-4">
              <p className="font-medium text-body text-foreground flex items-center gap-2">
                <span>🗳️</span> Abstimmung
              </p>
              <p className="text-caption text-muted-foreground ml-7">Zeit zum Abstimmen</p>
            </div>
            <TimeSelector
              times={VOTING_TIMES}
              selectedTime={settings.votingTimeSeconds}
              onSelect={(time) => onUpdateSettings({ votingTimeSeconds: time })}
              formatTime={formatVotingTime}
            />
          </SettingsRow>
        </SettingsGroup>
      </div>

      {/* Paywall Dialog */}
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </AppShell>
  );
}
