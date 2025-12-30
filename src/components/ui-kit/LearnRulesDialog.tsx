import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HowToPlayDialog } from './HowToPlayDialog';
import { cn } from '@/lib/utils';

interface LearnRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GameModeButton {
  id: 'secret-word' | 'drawing';
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const GAME_MODES: GameModeButton[] = [
  {
    id: 'secret-word',
    title: 'Secret Impostor',
    emoji: '🎭',
    color: 'text-game-orange',
    bgColor: 'bg-game-orange/10 hover:bg-game-orange/20',
  },
  {
    id: 'drawing',
    title: 'Fake Artist',
    emoji: '🎨',
    color: 'text-game-blue',
    bgColor: 'bg-game-blue/10 hover:bg-game-blue/20',
  },
];

export function LearnRulesDialog({ open, onOpenChange }: LearnRulesDialogProps) {
  const [selectedMode, setSelectedMode] = useState<'secret-word' | 'drawing' | null>(null);

  const handleSelectMode = (mode: 'secret-word' | 'drawing') => {
    setSelectedMode(mode);
  };

  const handleCloseHowToPlay = () => {
    setSelectedMode(null);
  };

  return (
    <>
      <Dialog open={open && !selectedMode} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[340px] bg-card border-border/20 p-0 overflow-hidden">
          <div className="p-5">
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-h3 text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  How to Play
                </DialogTitle>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center tap-scale"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </DialogHeader>

            <p className="text-body-sm text-muted-foreground mb-4">
              Select a game mode to learn the rules:
            </p>

            <div className="space-y-3">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleSelectMode(mode.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl transition-all tap-scale',
                    mode.bgColor
                  )}
                >
                  <span className="text-3xl">{mode.emoji}</span>
                  <span className={cn('font-bold text-body', mode.color)}>
                    {mode.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedMode && (
        <HowToPlayDialog 
          open={true}
          onOpenChange={handleCloseHowToPlay}
          gameMode={selectedMode}
        />
      )}
    </>
  );
}
