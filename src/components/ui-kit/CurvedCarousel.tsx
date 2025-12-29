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
    const translateZ = -absDiff * 120;
    const translateX = diff * 200;
    const scale = 1 - absDiff * 0.18;
    const opacity = Math.max(0, 1 - absDiff * 0.35);
    const zIndex = 100 - absDiff * 10;

    return {
      transform: `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg)
        scale(${Math.max(0.65, scale)})
      `,
      opacity: Math.max(0.2, opacity),
      zIndex,
      filter: absDiff > 0 ? `blur(${absDiff * 1}px)` : 'none',
      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease, filter 0.4s ease, z-index 0s',
      backfaceVisibility: 'hidden' as const,
      willChange: 'transform, opacity',
    };
  };

  return (
    <div className="relative">
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
      <div className="flex justify-center gap-2 mt-4">
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
