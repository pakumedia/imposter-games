import { ArrowLeft, Lock, Check, X, Sparkles, Minus, Plus, Zap, Cog } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AppShell } from '@/components/ui-kit';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { FREE_CATEGORY_NAMES, PRO_CATEGORY_NAMES } from '@/game/types';
import { DrawingGameMode } from '@/game/drawing-types';

interface DrawingSettingsScreenProps {
  settings: {
    gameMode: DrawingGameMode;
    drawingTimePerPlayer: number;
    maxDrawingRounds: number;
    discussionTimeSeconds: number;
    votingTimeSeconds: number;
    showCategoryToImpostor: boolean;
    selectedCategories: string[];
  };
  playerCount: number;
  onUpdateSettings: (settings: Partial<DrawingSettingsScreenProps['settings']>) => void;
  onBack: () => void;
}

const DRAWING_TIMES = [8, 10, 15, 20];
const DISCUSSION_TIMES = [30, 60, 90, 120];
const VOTING_TIMES = [30, 45, 60, 90];
const DRAWING_ROUNDS = [1, 2, 3];

// Category emoji mapping - same as Secret Word
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
  'Custom': '✨',
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

// Card Header Component with blue accent color for drawing
function CardHeader({ emoji, title, rightContent, className }: { emoji: string; title: string; rightContent?: ReactNode; className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 px-5 bg-[#0046FF] rounded-t-2xl",
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>
      </div>
      {rightContent}
    </div>
  );
}

// Game Mode Selector Component for Drawing - Vertical layout
function DrawingGameModeSelector({ 
  mode, 
  onChange 
}: { 
  mode: DrawingGameMode; 
  onChange: (mode: DrawingGameMode) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onChange('simple')}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all tap-scale",
          mode === 'simple'
            ? "border-[#0046FF] bg-[#0046FF]/10"
            : "border-border bg-card hover:border-muted-foreground/30"
        )}
      >
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          mode === 'simple' ? "bg-[#0046FF]" : "bg-muted"
        )}>
          <Zap className={cn("w-4 h-4", mode === 'simple' ? "text-white" : "text-muted-foreground")} />
        </div>
        <div className="flex-1 text-left">
          <span className={cn(
            "font-bold text-sm",
            mode === 'simple' ? "text-foreground" : "text-muted-foreground"
          )}>Einfach</span>
          <p className="text-xs text-muted-foreground">
            Spielt selbst ohne Timer
          </p>
        </div>
      </button>
      
      <button
        onClick={() => onChange('guided')}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all tap-scale",
          mode === 'guided'
            ? "border-[#0046FF] bg-[#0046FF]/10"
            : "border-border bg-card hover:border-muted-foreground/30"
        )}
      >
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          mode === 'guided' ? "bg-[#0046FF]" : "bg-muted"
        )}>
          <Cog className={cn("w-4 h-4", mode === 'guided' ? "text-white" : "text-muted-foreground")} />
        </div>
        <div className="flex-1 text-left">
          <span className={cn(
            "font-bold text-sm",
            mode === 'guided' ? "text-foreground" : "text-muted-foreground"
          )}>Erweitert</span>
          <p className="text-xs text-muted-foreground">
            Mit Timer und Voting
          </p>
        </div>
      </button>
    </div>
  );
}

// Category Card Component - no check, reduced border
function CategoryCard({ 
  name, 
  isSelected, 
  onToggle,
}: { 
  name: string; 
  isSelected: boolean; 
  onToggle: () => void;
}) {
  const emoji = CATEGORY_EMOJIS[name] || '📁';
  
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center gap-2.5 p-3 rounded-2xl transition-all tap-scale w-full overflow-hidden border-2",
        isSelected 
          ? "bg-card border-[#0046FF] shadow-md" 
          : "bg-card border-border hover:border-muted-foreground/30"
      )}
    >
      <span className="text-lg flex-shrink-0">{emoji}</span>
      <span className="font-semibold text-sm truncate text-left flex-1 text-foreground">
        {name}
      </span>
    </button>
  );
}

// PRO Category Card with shimmer (no individual lock)
function ProCategoryCard({ 
  name, 
}: { 
  name: string; 
}) {
  const emoji = CATEGORY_EMOJIS[name] || '📁';
  
  return (
    <div
      className="relative flex items-center gap-2.5 p-3 rounded-2xl w-full overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 border border-[#0046FF]/40"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
      <span className="text-lg flex-shrink-0 relative z-10">{emoji}</span>
      <span className="font-semibold text-sm truncate text-left flex-1 relative z-10 text-[#0046FF]">
        {name}
      </span>
    </div>
  );
}

// Premium Divider Component with unlock button
function PremiumDivider({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <button 
        onClick={onUnlock}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#0046FF]/20 to-[#0046FF]/10 border border-[#0046FF]/30 tap-scale group"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🔒</span>
          <span className="font-semibold text-sm text-[#0046FF]">PRO Kategorien</span>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0046FF] via-[#0055FF] to-[#0046FF] text-white text-xs font-bold shadow-lg group-hover:shadow-blue-300/50 transition-all">
          Freischalten
        </span>
      </button>
    </div>
  );
}

// Paywall Dialog Component
function PaywallDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md w-[calc(100%-24px)] p-0 gap-0 bg-gradient-to-b from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
        <div className="relative pt-8 pb-6 px-6 text-center bg-gradient-to-br from-[#0046FF] via-[#0055FF] to-[#0046FF]">
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

        <div className="px-6 py-5 border-b border-border">
          <div className="space-y-3">
            {[
              '10+ Premium Kategorien',
              'Eigene Kategorien erstellen',
              'Keine Werbung',
              'Früher Zugang zu neuen Features',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0046FF] to-[#0055FF] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {PRICING_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all relative tap-scale",
                selectedPlan === plan.id
                  ? "border-[#0046FF] bg-blue-50/50"
                  : "border-border bg-card hover:border-[#0046FF]/50"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#0046FF] to-[#0055FF] text-white text-xs font-semibold rounded-full">
                  Beliebt
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold text-foreground">{plan.name}</p>
                  {plan.savings && (
                    <p className="text-xs text-[#0046FF] font-medium">{plan.savings}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0046FF] to-[#0055FF] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all tap-scale">
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

// Time Counter Component - vertical layout (controls below text)
function TimeCounter({ 
  label,
  sublabel,
  emoji,
  times,
  selectedTime,
  onSelect,
  formatTime
}: { 
  label: string;
  sublabel: string;
  emoji: string;
  times: number[];
  selectedTime: number;
  onSelect: (time: number) => void;
  formatTime: (seconds: number) => string;
}) {
  const currentIndex = times.indexOf(selectedTime);
  
  const handleDecrement = () => {
    if (currentIndex > 0) {
      onSelect(times[currentIndex - 1]);
    }
  };

  const handleIncrement = () => {
    if (currentIndex < times.length - 1) {
      onSelect(times[currentIndex + 1]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="font-medium text-body text-foreground text-left">{label}</p>
          <p className="text-caption text-muted-foreground">{sublabel}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={currentIndex <= 0}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex <= 0 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>
        
        <span className="font-bold text-lg text-foreground min-w-[60px] text-center">
          {formatTime(selectedTime)}
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={currentIndex >= times.length - 1}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex >= times.length - 1 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

// Rounds Counter Component - vertical layout
function RoundsCounter({ 
  value, 
  onChange 
}: { 
  value: number;
  onChange: (value: number) => void;
}) {
  const currentIndex = DRAWING_ROUNDS.indexOf(value);
  
  const handleDecrement = () => {
    if (currentIndex > 0) {
      onChange(DRAWING_ROUNDS[currentIndex - 1]);
    }
  };

  const handleIncrement = () => {
    if (currentIndex < DRAWING_ROUNDS.length - 1) {
      onChange(DRAWING_ROUNDS[currentIndex + 1]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">🔄</span>
        <div>
          <p className="font-medium text-body text-foreground text-left">Zeichenrunden</p>
          <p className="text-caption text-muted-foreground">Wie oft jeder zeichnet</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={currentIndex <= 0}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex <= 0 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>
        
        <span className="font-bold text-lg text-foreground min-w-[60px] text-center">
          {value}x
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={currentIndex >= DRAWING_ROUNDS.length - 1}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex >= DRAWING_ROUNDS.length - 1 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

export function DrawingSettingsScreen({
  settings,
  playerCount,
  onUpdateSettings,
  onBack,
}: DrawingSettingsScreenProps) {
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
    return seconds < 60 ? `${seconds}s` : `${seconds / 60} min`;
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

        {/* Drawing is always guided, no game mode selector needed */}

        {/* 1. Drawing Settings Section */}
        <SettingsGroup>
          <CardHeader emoji="🎨" title="Zeichnen" />
          <SettingsRow>
            <TimeCounter
              label="Zeit pro Zug"
              sublabel="Sekunden zum Zeichnen"
              emoji="⏱️"
              times={DRAWING_TIMES}
              selectedTime={settings.drawingTimePerPlayer}
              onSelect={(time) => onUpdateSettings({ drawingTimePerPlayer: time })}
              formatTime={(s) => `${s}s`}
            />
          </SettingsRow>
          <SettingsRow isLast>
            <RoundsCounter
              value={settings.maxDrawingRounds}
              onChange={(value) => onUpdateSettings({ maxDrawingRounds: value })}
            />
          </SettingsRow>
        </SettingsGroup>

        {/* 2. Time Settings Section */}
        <SettingsGroup className="mt-6">
          <CardHeader emoji="⏱️" title="Zeiten" />
          <SettingsRow>
            <TimeCounter
              label="Diskussion"
              sublabel="Zeit zum Diskutieren"
              emoji="💬"
              times={DISCUSSION_TIMES}
              selectedTime={settings.discussionTimeSeconds}
              onSelect={(time) => onUpdateSettings({ discussionTimeSeconds: time })}
              formatTime={formatTime}
            />
          </SettingsRow>
          <SettingsRow isLast>
            <TimeCounter
              label="Abstimmung"
              sublabel="Zeit zum Abstimmen"
              emoji="🗳️"
              times={VOTING_TIMES}
              selectedTime={settings.votingTimeSeconds}
              onSelect={(time) => onUpdateSettings({ votingTimeSeconds: time })}
              formatTime={formatVotingTime}
            />
          </SettingsRow>
        </SettingsGroup>

        {/* 3. Impostor Helpers Section - after Zeiten */}
        <SettingsGroup className="mt-6">
          <CardHeader emoji="💡" title="Impostor Hilfen" />
          <SettingsRow isLast>
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
                accentColor="#0046FF"
              />
            </div>
          </SettingsRow>
        </SettingsGroup>

        {/* 4. All Categories (Free + Pro) - same as Secret Word */}
        <SettingsGroup className="mt-6">
          <CardHeader 
            emoji="📂" 
            title="Kategorien" 
            rightContent={
              <button 
                onClick={handleSelectAllFree}
                className="text-caption text-white/80 font-semibold tap-scale"
              >
                Alle auswählen
              </button>
            }
          />
          
          {/* Free Categories - 2x3 Grid */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {FREE_CATEGORY_NAMES.map((category) => (
              <CategoryCard
                key={category}
                name={category}
                isSelected={settings.selectedCategories.includes(category)}
                onToggle={() => handleCategoryToggle(category)}
              />
            ))}
          </div>
          
          {/* Premium Divider */}
          <PremiumDivider onUnlock={handleProCategoryClick} />
          
          {/* Pro Categories - with overlay lock */}
          <div className="relative p-4">
            {/* PRO Cards Grid */}
            <div className="grid grid-cols-2 gap-3 opacity-60">
              <ProCategoryCard name="Custom" />
              {PRO_CATEGORY_NAMES.map((category) => (
                <ProCategoryCard key={category} name={category} />
              ))}
            </div>
            
            {/* Lock Overlay */}
            <button 
              onClick={handleProCategoryClick}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-[#0046FF]/5 to-[#0046FF]/20 rounded-b-2xl tap-scale"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0046FF] to-[#0055FF] flex items-center justify-center shadow-xl">
                <span className="text-3xl">🔒</span>
              </div>
            </button>
          </div>
        </SettingsGroup>
      </div>

      {/* Paywall Dialog */}
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </AppShell>
  );
}
