import { useRef, useState, useEffect, useCallback } from 'react';
import { DrawingLine, DrawingPoint } from '@/game/drawing-types';

interface DrawingCanvasProps {
  lines: DrawingLine[];
  playerColor: string;
  playerId: string;
  isDrawingEnabled: boolean;
  onLineComplete: (line: DrawingLine) => void;
  strokeWidth?: number;
}

export function DrawingCanvas({
  lines,
  playerColor,
  playerId,
  isDrawingEnabled,
  onLineComplete,
  strokeWidth = 4,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  // Resize canvas to fit container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height, 400);
        setCanvasSize({ width: size, height: size });
      }
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(updateSize, 10);
    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Draw all lines on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all completed lines
    lines.forEach(line => {
      if (line.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
    });

    // Draw current line being drawn
    if (currentPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = playerColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();
    }
  }, [lines, currentPoints, playerColor, strokeWidth]);

  // Redraw when canvas size changes or lines change
  useEffect(() => {
    // Small delay to ensure canvas is fully sized
    const timer = setTimeout(() => {
      drawCanvas();
    }, 20);
    return () => clearTimeout(timer);
  }, [drawCanvas, canvasSize]);

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent): DrawingPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingEnabled) return;
    e.preventDefault();
    
    const point = getCoordinates(e);
    if (point) {
      setIsDrawing(true);
      setCurrentPoints([point]);
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || !isDrawingEnabled) return;
    e.preventDefault();

    const point = getCoordinates(e);
    if (point) {
      setCurrentPoints(prev => [...prev, point]);
    }
  };

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || !isDrawingEnabled) return;
    e.preventDefault();

    if (currentPoints.length > 1) {
      const newLine: DrawingLine = {
        points: currentPoints,
        playerId,
        color: playerColor,
        strokeWidth,
      };
      onLineComplete(newLine);
    }

    setIsDrawing(false);
    setCurrentPoints([]);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-square flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="rounded-card bg-card shadow-card touch-none"
        style={{ 
          cursor: isDrawingEnabled ? 'crosshair' : 'default',
          border: isDrawingEnabled ? `3px solid ${playerColor}` : '3px solid transparent',
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
}
