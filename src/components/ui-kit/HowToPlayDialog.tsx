import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Eye, EyeOff, MessageCircle, Vote, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface HowToPlayStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
}

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameMode: 'secret-word' | 'drawing';
}

const SECRET_WORD_STEPS: HowToPlayStep[] = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Geheimes Wort',
    description: 'Alle Spieler bekommen das gleiche geheime Wort - außer der Impostor!',
    visual: (
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-game-green flex items-center justify-center mb-2">
            <span className="text-xl">👤</span>
          </div>
          <div className="px-3 py-1 bg-game-green/20 rounded-lg text-xs font-bold text-game-green">
            APFEL
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-game-green flex items-center justify-center mb-2">
            <span className="text-xl">👤</span>
          </div>
          <div className="px-3 py-1 bg-game-green/20 rounded-lg text-xs font-bold text-game-green">
            APFEL
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center mb-2">
            <span className="text-xl">🎭</span>
          </div>
          <div className="px-3 py-1 bg-destructive/20 rounded-lg text-xs font-bold text-destructive">
            ???
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Hinweise geben',
    description: 'Jeder gibt reihum einen Ein-Wort-Hinweis. Sei clever - verrate nicht zu viel!',
    visual: (
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-card/80 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-game-blue flex items-center justify-center text-sm">A</div>
          <div className="px-3 py-1.5 bg-primary/10 rounded-pill text-sm font-medium">"Rot"</div>
        </div>
        <div className="flex items-center gap-3 bg-card/80 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-game-purple flex items-center justify-center text-sm">B</div>
          <div className="px-3 py-1.5 bg-primary/10 rounded-pill text-sm font-medium">"Frucht"</div>
        </div>
        <div className="flex items-center gap-3 bg-card/80 rounded-xl p-3 border-2 border-destructive/30">
          <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-sm">🎭</div>
          <div className="px-3 py-1.5 bg-primary/10 rounded-pill text-sm font-medium">"Rund...?"</div>
        </div>
      </div>
    ),
  },
  {
    icon: <Vote className="w-6 h-6" />,
    title: 'Diskussion & Abstimmung',
    description: 'Diskutiert wer der Impostor ist und stimmt ab!',
    visual: (
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/40 flex items-center justify-center animate-pulse">
            <span className="text-4xl">🗳️</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-primary-foreground text-xs flex items-center justify-center font-bold">
            3
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Gewinner',
    description: 'Findet den Impostor = Crew gewinnt! Impostor unentdeckt = Impostor gewinnt!',
    visual: (
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-game-green/20 flex items-center justify-center mb-2">
            <span className="text-3xl">👥</span>
          </div>
          <span className="text-xs font-bold text-game-green">CREW</span>
        </div>
        <span className="text-2xl font-bold text-muted-foreground">VS</span>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mb-2">
            <span className="text-3xl">🎭</span>
          </div>
          <span className="text-xs font-bold text-destructive">IMPOSTOR</span>
        </div>
      </div>
    ),
  },
];

const DRAWING_STEPS: HowToPlayStep[] = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Geheimes Motiv',
    description: 'Alle sehen das Motiv - außer der Fake Artist!',
    visual: (
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-game-blue flex items-center justify-center mb-2">
            <span className="text-xl">🎨</span>
          </div>
          <div className="px-3 py-1 bg-game-blue/20 rounded-lg text-xs font-bold text-game-blue">
            HAUS
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-game-blue flex items-center justify-center mb-2">
            <span className="text-xl">🎨</span>
          </div>
          <div className="px-3 py-1 bg-game-blue/20 rounded-lg text-xs font-bold text-game-blue">
            HAUS
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center mb-2">
            <span className="text-xl">🎭</span>
          </div>
          <div className="px-3 py-1 bg-destructive/20 rounded-lg text-xs font-bold text-destructive">
            ???
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <EyeOff className="w-6 h-6" />,
    title: 'Eine Linie zeichnen',
    description: 'Jeder zeichnet reihum EINE Linie. Der Fake Artist muss so tun als wüsste er das Motiv!',
    visual: (
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 bg-card rounded-xl border-2 border-border relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M30 70 L50 30 L70 70" stroke="#4299E1" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M25 70 L75 70" stroke="#48BB78" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M45 45 L55 45 L55 60 L45 60 Z" stroke="#9F7AEA" strokeWidth="2" fill="none" strokeLinecap="round" className="animate-pulse" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    icon: <Vote className="w-6 h-6" />,
    title: 'Diskussion & Voting',
    description: 'Nach dem Zeichnen diskutiert ihr und stimmt ab wer der Fake Artist ist!',
    visual: (
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-game-blue/20 to-game-blue/40 flex items-center justify-center animate-pulse">
            <span className="text-4xl">🔍</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Gewinner',
    description: 'Fake Artist entlarvt = Künstler gewinnen! Fake Artist unentdeckt = Fake Artist gewinnt!',
    visual: (
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-game-blue/20 flex items-center justify-center mb-2">
            <span className="text-3xl">🎨</span>
          </div>
          <span className="text-xs font-bold text-game-blue">KÜNSTLER</span>
        </div>
        <span className="text-2xl font-bold text-muted-foreground">VS</span>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mb-2">
            <span className="text-3xl">🎭</span>
          </div>
          <span className="text-xs font-bold text-destructive">FAKE</span>
        </div>
      </div>
    ),
  },
];

export function HowToPlayDialog({ open, onOpenChange, gameMode }: HowToPlayDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = gameMode === 'drawing' ? DRAWING_STEPS : SECRET_WORD_STEPS;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[380px] w-[calc(100%-24px)] bg-card border-border/20 p-0 overflow-hidden rounded-3xl">
        {/* Header */}
        <div className={cn(
          'p-4 pb-3',
          gameMode === 'drawing' ? 'bg-game-blue/10' : 'bg-game-orange/10'
        )}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-h3 text-foreground flex items-center gap-2">
                <span className="text-xl">{gameMode === 'drawing' ? '🎨' : '🎭'}</span>
                How to Play
              </DialogTitle>
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center tap-scale"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </DialogHeader>
          
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 rounded-full flex-1 transition-all',
                  index <= currentStep 
                    ? gameMode === 'drawing' ? 'bg-game-blue' : 'bg-game-orange'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-4">
          <div className="text-center mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center',
              gameMode === 'drawing' ? 'bg-game-blue/20 text-game-blue' : 'bg-game-orange/20 text-game-orange'
            )}>
              {step.icon}
            </div>
            <h3 className="text-h3 text-foreground mb-1">{step.title}</h3>
            <p className="text-body-sm text-muted-foreground">{step.description}</p>
          </div>

          {/* Visual */}
          <div className="bg-secondary/50 rounded-2xl p-4 min-h-[140px] flex items-center justify-center">
            {step.visual}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 pt-0 flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all tap-scale',
              currentStep === 0 
                ? 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed' 
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className={cn(
              'flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-all tap-scale shadow-button',
              gameMode === 'drawing' 
                ? 'bg-[#70BBED] text-white hover:bg-[#5AAAD8]' 
                : 'bg-game-orange text-white hover:bg-game-orange-dark'
            )}
          >
            {currentStep === steps.length - 1 ? "Los geht's!" : 'Weiter'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
