import { cn } from '@/lib/utils';

interface AnswerPillProps {
  letter: string;
  text: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function AnswerPill({
  letter,
  text,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  onClick,
  disabled = false
}: AnswerPillProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-14 w-full rounded-pill flex items-center gap-3 px-4 transition-all duration-200 tap-scale',
        isCorrect 
          ? 'bg-game-green text-primary-foreground shadow-button'
          : isWrong
            ? 'bg-destructive text-destructive-foreground shadow-button'
            : isSelected 
              ? 'bg-primary text-primary-foreground shadow-button'
              : 'bg-card shadow-soft hover:bg-secondary',
        disabled && 'pointer-events-none'
      )}
    >
      <span className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-caption flex-shrink-0',
        isSelected || isCorrect || isWrong
          ? 'bg-primary-foreground/20 text-inherit'
          : 'bg-game-green text-primary-foreground'
      )}>
        {letter}
      </span>
      <span className="font-semibold text-body-sm truncate">{text}</span>
    </button>
  );
}
