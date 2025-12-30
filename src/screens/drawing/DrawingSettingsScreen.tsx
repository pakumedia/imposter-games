import { ArrowLeft, Lock, Check, X, Sparkles, Minus, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AppShell, ImpostorCounter } from '@/components/ui-kit';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { DRAWING_WORD_CATEGORIES } from '@/game/drawing-types';

interface DrawingSettingsScreenProps {
  settings: {
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

// Category emoji mapping for drawing
const CATEGORY_EMOJIS: Record<string, string> = {
  'Easy': '⭐',
  'Animals': '🐾',
  'Food': '🍕',
  'Objects': '🪑',
  'Nature': '🌿',
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

// Category Card Component for Drawing
function CategoryCard({ 
  name, 
  isSelected, 
  isPro = false, 
  onToggle,
}: { 
  name: string; 
  isSelected: boolean; 
  isPro?: boolean;
  onToggle: () => void;
}) {
  const emoji = CATEGORY_EMOJIS[name] || '📁';
  
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center gap-2.5 p-3 rounded-xl transition-all tap-scale w-full overflow-hidden",
        isPro 
          ? "bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 border-2 border-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          : isSelected 
            ? "bg-card border-[3px] border-[#0046FF] shadow-md" 
            : "bg-card border-2 border-border hover:border-muted-foreground/30"
      )}
    >
      {/* Premium shimmer effect for PRO cards */}
      {isPro && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
      )}
      
      <span className="text-lg flex-shrink-0 relative z-10">{emoji}</span>
      
      <span className={cn(
        "font-semibold text-sm truncate text-left flex-1 relative z-10",
        isPro ? "text-amber-700" : "text-foreground"
      )}>
        {name}
      </span>
      
      {!isPro && isSelected && (
        <div className="w-5 h-5 rounded-full bg-[#0046FF] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white stroke-[3]" />
        </div>
      )}
      
      {isPro && (
        <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 relative z-10" />
      )}
    </button>
  );
}

// Paywall Dialog Component
function PaywallDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-gradient-to-b from-white to-amber-50/30 border-0 rounded-3xl overflow-hidden">
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

// Time Counter Component
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="font-medium text-body text-foreground text-left">{label}</p>
          <p className="text-caption text-muted-foreground">{sublabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={currentIndex <= 0}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex <= 0 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>
        
        <span className="font-semibold text-foreground min-w-[50px] text-center">
          {formatTime(selectedTime)}
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={currentIndex >= times.length - 1}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex >= times.length - 1 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

// Rounds Counter Component
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <span className="text-xl">🔄</span>
        <div>
          <p className="font-medium text-body text-foreground text-left">Zeichenrunden</p>
          <p className="text-caption text-muted-foreground">Wie oft jeder zeichnet</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={currentIndex <= 0}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex <= 0 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>
        
        <span className="font-semibold text-foreground min-w-[50px] text-center">
          {value}x
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={currentIndex >= DRAWING_ROUNDS.length - 1}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale",
            "bg-muted/60 text-muted-foreground",
            currentIndex >= DRAWING_ROUNDS.length - 1 
              ? "opacity-40 cursor-not-allowed" 
              : "hover:bg-muted active:scale-95"
          )}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
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
  
  const categoryNames = Object.keys(DRAWING_WORD_CATEGORIES);

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
    onUpdateSettings({ selectedCategories: [...categoryNames] });
  };

  const formatTime = (seconds: number) => {
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

        {/* 1. Drawing Settings Section */}
        <SettingsGroup className="mt-6">
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

        {/* 2. Impostor Helpers Section */}
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
              />
            </div>
          </SettingsRow>
        </SettingsGroup>

        {/* 3. Time Settings Section */}
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
              formatTime={formatTime}
            />
          </SettingsRow>
        </SettingsGroup>

        {/* 4. Categories */}
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
          
          <div className="p-4 grid grid-cols-2 gap-3">
            {categoryNames.map((category) => (
              <CategoryCard
                key={category}
                name={category}
                isSelected={settings.selectedCategories.includes(category)}
                onToggle={() => handleCategoryToggle(category)}
              />
            ))}
          </div>
        </SettingsGroup>
      </div>

      {/* Paywall Dialog */}
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </AppShell>
  );
}