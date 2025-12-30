import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguageStore, Language } from '@/i18n';
import { cn } from '@/lib/utils';
import { FlagIcon } from './FlagIcon';

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGES: { id: Language; label: string; flagCode: 'de' | 'gb' }[] = [
  { id: 'de', label: 'Deutsch', flagCode: 'de' },
  { id: 'en', label: 'English', flagCode: 'gb' },
];

export function LanguageDialog({ open, onOpenChange }: LanguageDialogProps) {
  const { language, setLanguage, t } = useLanguageStore();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[340px] w-[calc(100%-24px)] bg-card border-border/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-h3 text-foreground">
            {t('selectLanguage')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors tap-scale',
                language === lang.id
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-background/50 hover:bg-background/80 border-2 border-transparent'
              )}
            >
              <FlagIcon country={lang.flagCode} className="w-7 h-5" />
              <span className="flex-1 text-left text-body font-medium text-foreground">
                {lang.label}
              </span>
              {language === lang.id && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
