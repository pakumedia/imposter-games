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
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleSelect = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(children.length - 1, index));
    setInternalIndex(clampedIndex);
    onSelect?.(clampedIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startXRef.current - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSelect(selectedIndex + 1);
      } else {
        handleSelect(selectedIndex - 1);
      }
    }
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = startXRef.current - e.clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSelect(selectedIndex + 1);
      } else {
        handleSelect(selectedIndex - 1);
      }
    }
    isDraggingRef.current = false;
  };

  const getCardStyle = (index: number) => {
    const diff = index - selectedIndex;
    const absDiff = Math.abs(diff);
    
    // Arc parameters
    const rotateY = diff * 35;
    const translateZ = -absDiff * 80;
    const translateX = diff * 180;
    const scale = 1 - absDiff * 0.15;
    const opacity = Math.max(0, 1 - absDiff * 0.3);
    const zIndex = 10 - absDiff;

    return {
      transform: `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg)
        scale(${Math.max(0.7, scale)})
      `,
      opacity: Math.max(0.3, opacity),
      zIndex,
      filter: absDiff > 0 ? `blur(${absDiff * 0.5}px)` : 'none',
      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease, filter 0.4s ease',
    };
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="relative h-[480px] w-full touch-pan-y"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDraggingRef.current = false; }}
      >
        {/* 3D Scene */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={cn(
                'absolute w-[280px] cursor-pointer pointer-events-auto',
              )}
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

      {/* Progress indicators - outside the carousel */}
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
