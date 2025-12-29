import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface GameHeaderProps {
  onExit?: () => void;
  rightContent?: ReactNode;
  title?: string;
}

export function GameHeader({ onExit, rightContent, title }: GameHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between screen-padding">
      <div className="flex items-center gap-3">
        {onExit && (
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center tap-scale hover:bg-muted transition-colors"
            aria-label="Exit game"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        {title && (
          <span className="font-bold text-body text-foreground">{title}</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {rightContent}
      </div>
    </header>
  );
}
