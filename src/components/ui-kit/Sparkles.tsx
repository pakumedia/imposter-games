import { cn } from '@/lib/utils';

interface SparklesProps {
  className?: string;
  count?: number;
}

export function Sparkles({ className = '', count = 6 }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    delay: Math.random() * 2,
  }));

  return (
    <div className={cn('pointer-events-none', className)}>
      {sparkles.map((sparkle) => (
        <svg
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            top: sparkle.top,
            left: sparkle.left,
            animationDelay: `${sparkle.delay}s`,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      ))}
    </div>
  );
}
