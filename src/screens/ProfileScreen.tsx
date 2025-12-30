import { useState } from 'react';
import { ChevronRight, Globe, Star, MessageSquare, Info, Copy, Crown, BookOpen, Check, ExternalLink } from 'lucide-react';
import { AppShell, LearnRulesDialog } from '@/components/ui-kit';
import { LanguageDialog } from '@/components/ui-kit/LanguageDialog';
import { FlagIcon } from '@/components/ui-kit/FlagIcon';
import { useLanguageStore } from '@/i18n';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import tapWordsIcon from '@/assets/tap-words-icon.png';
import wavelengthIcon from '@/assets/wavelength-icon.png';
import { PaywallDialog } from './SettingsScreen';

interface ProfileScreenProps {
  onBack?: () => void;
}

interface SettingsItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}

// Language flags mapping
const LANGUAGE_FLAGS: Record<string, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
};

function SettingsRow({ item }: { item: SettingsItem }) {
  return (
    <button
      onClick={item.onClick}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3.5',
        'bg-card/50 hover:bg-card/80 transition-colors tap-scale',
        'first:rounded-t-2xl last:rounded-b-2xl',
        'border-b border-border/10 last:border-b-0'
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {item.icon}
      </div>
      <span className="flex-1 text-left text-body font-medium text-foreground">
        {item.label}
      </span>
      {item.value && (
        <span className="text-caption text-muted-foreground">{item.value}</span>
      )}
      {item.rightElement ? item.rightElement : (
        <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
      )}
    </button>
  );
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { t, language } = useLanguageStore();
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [learnRulesOpen, setLearnRulesOpen] = useState(false);
  const [copiedCustomerId, setCopiedCustomerId] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const languageFlag = LANGUAGE_FLAGS[language] || '🌐';
  const customerId = 'USR-2024-ABCD-1234';

  const handleCopyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    setCopiedCustomerId(true);
    toast.success('Customer ID copied!');
    setTimeout(() => setCopiedCustomerId(false), 2000);
  };

  const handleOpenAppStore = () => {
    window.open('https://apps.apple.com/de/app/tap-words-game/id6755069139', '_blank');
  };

  const generalSection: SettingsItem[] = [
    { 
      id: 'rules', 
      icon: <BookOpen className="w-5 h-5" />, 
      label: 'Learn the Rules',
      onClick: () => setLearnRulesOpen(true),
    },
    { 
      id: 'language', 
      icon: <Globe className="w-5 h-5" />, 
      label: t('language'), 
      rightElement: (
        <div className="flex items-center gap-2">
          <FlagIcon country={language === 'de' ? 'de' : 'gb'} className="w-6 h-4" />
          <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
        </div>
      ),
      onClick: () => setLanguageDialogOpen(true),
    },
    { 
      id: 'rate', 
      icon: <Star className="w-5 h-5" />, 
      label: 'Rate App',
    },
    { 
      id: 'feedback', 
      icon: <MessageSquare className="w-5 h-5" />, 
      label: 'Send Feedback',
    },
  ];

  return (
    <AppShell>
      {/* Header */}
      <div className="screen-padding pt-safe-top">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-h1 text-foreground">{t('profile')}</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="screen-padding space-y-6 pb-32">
        {/* Premium Upgrade Card */}
        <button 
          onClick={() => setShowPaywall(true)}
          className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-game-orange via-game-orange to-game-yellow p-5 shadow-lg text-left tap-scale"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-h3 text-white font-bold">Upgrade to Premium</h2>
              <p className="text-body-sm text-white/80">and unlock infinite fun</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/70" />
          </div>
        </button>

        {/* General Section */}
        <div>
          <h3 className="text-caption text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
            General
          </h3>
          <div className="rounded-2xl overflow-hidden">
            {generalSection.map((item) => (
              <SettingsRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Our Other Apps Section */}
        <div>
          <h3 className="text-caption text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
            Our Other Apps
          </h3>
          <div className="space-y-2">
            {/* Tap Words Game */}
            <button 
              onClick={handleOpenAppStore}
              className="w-full flex items-center gap-4 px-4 py-4 bg-card/50 hover:bg-card/80 transition-colors tap-scale rounded-2xl"
            >
              <img 
                src={tapWordsIcon} 
                alt="Tap Words Game"
                className="w-14 h-14 rounded-xl shadow-md"
              />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-body text-foreground">Tap Words Game</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-game-yellow fill-game-yellow" />
                    <span className="text-caption font-semibold text-foreground">4.8</span>
                  </div>
                  <span className="text-caption text-muted-foreground">•</span>
                  <span className="text-caption text-game-teal font-medium">Recently Updated</span>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground/50" />
            </button>
            
            {/* Wavelength: Headsynch */}
            <button 
              onClick={() => window.open('https://apps.apple.com/de/app/perfect-match-headsynch/id6753659486', '_blank')}
              className="w-full flex items-center gap-4 px-4 py-4 bg-card/50 hover:bg-card/80 transition-colors tap-scale rounded-2xl"
            >
              <img 
                src={wavelengthIcon} 
                alt="Wavelength: Headsynch"
                className="w-14 h-14 rounded-xl shadow-md"
              />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-body text-foreground">Wavelength: Headsynch</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-game-yellow fill-game-yellow" />
                    <span className="text-caption font-semibold text-foreground">4.7</span>
                  </div>
                  <span className="text-caption text-muted-foreground">•</span>
                  <span className="text-caption text-game-teal font-medium">Recently Updated</span>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground/50" />
            </button>
          </div>
        </div>

        {/* App Information Section - Combined with Customer ID */}
        <div>
          <h3 className="text-caption text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
            App Information
          </h3>
          <div className="rounded-2xl overflow-hidden bg-card/50">
            {/* App Version Row */}
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Info className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left text-body font-medium text-foreground">
                App Version
              </span>
              <span className="text-caption text-muted-foreground">1.0.1</span>
            </div>
            
            {/* Customer ID Row */}
            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Copy className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-body font-medium text-foreground">Customer ID</span>
                <code className="block text-caption text-muted-foreground font-mono mt-0.5">{customerId}</code>
              </div>
              <button
                onClick={handleCopyCustomerId}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all tap-scale",
                  copiedCustomerId 
                    ? "bg-game-green text-white" 
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {copiedCustomerId ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Dialog */}
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />

      {/* Language Dialog */}
      <LanguageDialog 
        open={languageDialogOpen} 
        onOpenChange={setLanguageDialogOpen} 
      />

      {/* Learn Rules Dialog */}
      <LearnRulesDialog
        open={learnRulesOpen}
        onOpenChange={setLearnRulesOpen}
      />
    </AppShell>
  );
}
