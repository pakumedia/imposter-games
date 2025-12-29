import { ChevronRight, Globe, Bell, Volume2, Moon, Shield, HelpCircle, LogOut, User } from 'lucide-react';
import { AppShell } from '@/components/ui-kit';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
  onBack?: () => void;
}

interface SettingsItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SETTINGS_SECTIONS = [
  {
    title: 'Profil',
    items: [
      { id: 'account', icon: <User className="w-5 h-5" />, label: 'Account', value: 'Guest' },
    ],
  },
  {
    title: 'Einstellungen',
    items: [
      { id: 'language', icon: <Globe className="w-5 h-5" />, label: 'Sprache', value: 'Deutsch' },
      { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Benachrichtigungen' },
      { id: 'sound', icon: <Volume2 className="w-5 h-5" />, label: 'Sound & Vibration' },
      { id: 'theme', icon: <Moon className="w-5 h-5" />, label: 'Erscheinungsbild', value: 'System' },
    ],
  },
  {
    title: 'Mehr',
    items: [
      { id: 'privacy', icon: <Shield className="w-5 h-5" />, label: 'Datenschutz' },
      { id: 'help', icon: <HelpCircle className="w-5 h-5" />, label: 'Hilfe & Support' },
    ],
  },
];

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
      <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
    </button>
  );
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <AppShell>
      {/* Header */}
      <div className="screen-padding pt-safe-top">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-h1 text-foreground">Profil</h1>
        </div>
      </div>

      {/* Profile Avatar Section */}
      <div className="screen-padding mb-6">
        <div className="flex items-center gap-4 p-4 bg-card/50 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-h3 text-foreground font-bold">Guest</h2>
            <p className="text-caption text-muted-foreground">Tippe um dich anzumelden</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="screen-padding space-y-6 pb-32">
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-caption text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <div className="rounded-2xl overflow-hidden">
              {section.items.map((item) => (
                <SettingsRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors tap-scale">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Abmelden</span>
        </button>
      </div>
    </AppShell>
  );
}
