import { useState, useRef, useEffect, ReactNode } from 'react';
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
  
  // Parallax state for device orientation
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasGyro, setHasGyro] = useState(false);

  // Device orientation handler
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        setHasGyro(true);
        // gamma: left-right tilt (-90 to 90)
        // beta: front-back tilt (-180 to 180)
        const x = Math.max(-20, Math.min(20, event.gamma)) / 20; // Normalize to -1 to 1
        const y = Math.max(-20, Math.min(20, (event.beta || 0) - 45)) / 20; // Normalize, assuming phone held at ~45°
        setTilt({ x, y });
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // We'll request on first interaction
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Mouse parallax for desktop (fallback when no gyro)
  useEffect(() => {
    if (hasGyro) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (event.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasGyro]);

  // Request gyro permission on touch (for iOS)
  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            if (event.gamma !== null && event.beta !== null) {
              setHasGyro(true);
              const x = Math.max(-20, Math.min(20, event.gamma)) / 20;
              const y = Math.max(-20, Math.min(20, (event.beta || 0) - 45)) / 20;
              setTilt({ x, y });
            }
          });
        }
      } catch (error) {
        console.log('Gyro permission denied');
      }
    }
  };

  const handleSelect = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(children.length - 1, index));
    setInternalIndex(clampedIndex);
    onSelect?.(clampedIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    requestGyroPermission();
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

  // Get current parallax values (gyro or mouse)
  const parallax = hasGyro ? tilt : mousePosition;

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

    // Add parallax offset based on tilt/mouse - stronger for center card
    const parallaxStrength = index === selectedIndex ? 15 : 8;
    const parallaxX = parallax.x * parallaxStrength;
    const parallaxY = parallax.y * parallaxStrength * 0.5;
    const parallaxRotateX = -parallax.y * 5;
    const parallaxRotateY = parallax.x * 8;

    return {
      transform: `
        translateX(${translateX + parallaxX}px) 
        translateY(${parallaxY}px)
        translateZ(${translateZ}px) 
        rotateX(${parallaxRotateX}deg)
        rotateY(${rotateY + parallaxRotateY}deg)
        scale(${Math.max(0.7, scale)})
      `,
      opacity: Math.max(0.3, opacity),
      zIndex,
      filter: absDiff > 0 ? `blur(${absDiff * 0.5}px)` : 'none',
      transition: isDraggingRef.current ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
