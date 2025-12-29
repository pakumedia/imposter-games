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
    const rotateY = diff * 35; // Rotation angle per card
    const translateZ = -absDiff * 80; // Push back cards on sides
    const translateX = diff * 180; // Horizontal spread
    const scale = 1 - absDiff * 0.15; // Scale down side cards
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
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-[520px] w-full"
      style={{ perspective: '1200px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { isDraggingRef.current = false; }}
    >
      {/* 3D Scene */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            className={cn(
              'absolute w-[280px] cursor-pointer transition-all duration-500 ease-out',
              index === selectedIndex ? 'pointer-events-auto' : 'pointer-events-auto'
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

      {/* Progress indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
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
