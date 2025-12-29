import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CurvedCarouselProps {
  children: ReactNode[];
  onSelect?: (index: number) => void;
  selectedIndex?: number;
}

export function CurvedCarousel({ children, onSelect, selectedIndex: controlledIndex }: CurvedCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const selectedIndex = controlledIndex ?? internalIndex;
  const startXRef = useRef(0);
  const hasMoved = useRef(false);

  const handleSelect = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(children.length - 1, index));
    setInternalIndex(clampedIndex);
    onSelect?.(clampedIndex);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    hasMoved.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const diff = Math.abs(e.clientX - startXRef.current);
    if (diff > 10) {
      hasMoved.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const diff = startXRef.current - e.clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSelect(selectedIndex + 1);
      } else {
        handleSelect(selectedIndex - 1);
      }
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - selectedIndex;
    const absDiff = Math.abs(diff);
    
    const rotateY = diff * 35;
    const translateZ = -absDiff * 150;
    const translateX = diff * 220;
    const scale = 1 - absDiff * 0.2;
    const opacity = Math.max(0, 1 - absDiff * 0.4);
    // Higher base z-index, and ensure center card is always on top
    const zIndex = absDiff === 0 ? 1000 : 100 - absDiff * 20;

    return {
      transform: `
        perspective(1200px)
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg)
        scale(${Math.max(0.6, scale)})
      `,
      opacity: Math.max(0.15, opacity),
      zIndex,
      filter: absDiff > 0 ? `blur(${absDiff * 1.5}px)` : 'none',
      transition: 'transform 0.35s ease-out, opacity 0.35s ease-out, filter 0.35s ease-out',
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
      isolation: 'isolate' as const,
    };
  };

  return (
    <div className="relative pt-8">
      <div 
        className="relative h-[480px] w-full cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1200px', touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* 3D Scene */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              onClick={() => !hasMoved.current && handleSelect(index)}
              className="absolute w-[280px]"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={cn(
              'rounded-full transition-all duration-300 tap-scale',
              index === selectedIndex 
                ? 'w-6 h-2 bg-foreground' 
                : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
