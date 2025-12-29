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
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<DrawingPoint[]>([]);
  const lastPointRef = useRef<DrawingPoint | null>(null);
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

    const timer = setTimeout(updateSize, 10);
    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Draw all completed lines on canvas
  const drawAllLines = useCallback(() => {
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
  }, [lines]);

  // Redraw when canvas size changes or lines change
  useEffect(() => {
    const timer = setTimeout(() => {
      drawAllLines();
    }, 20);
    return () => clearTimeout(timer);
  }, [drawAllLines, canvasSize]);

  // Draw a line segment directly on canvas (no React state)
  const drawLineSegment = useCallback((from: DrawingPoint, to: DrawingPoint) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = playerColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, [playerColor, strokeWidth]);

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent): DrawingPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingEnabled) return;
    e.preventDefault();
    
    const point = getCoordinates(e);
    if (point) {
      isDrawingRef.current = true;
      currentPointsRef.current = [point];
      lastPointRef.current = point;
    }
  }, [isDrawingEnabled, getCoordinates]);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current || !isDrawingEnabled) return;
    e.preventDefault();

    const point = getCoordinates(e);
    if (point && lastPointRef.current) {
      // Draw immediately on canvas
      drawLineSegment(lastPointRef.current, point);
      // Store point for final line
      currentPointsRef.current.push(point);
      lastPointRef.current = point;
    }
  }, [isDrawingEnabled, getCoordinates, drawLineSegment]);

  const handleEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current || !isDrawingEnabled) return;
    e.preventDefault();

    if (currentPointsRef.current.length > 1) {
      const newLine: DrawingLine = {
        points: [...currentPointsRef.current],
        playerId,
        color: playerColor,
        strokeWidth,
      };
      onLineComplete(newLine);
    }

    isDrawingRef.current = false;
    currentPointsRef.current = [];
    lastPointRef.current = null;
  }, [isDrawingEnabled, playerId, playerColor, strokeWidth, onLineComplete]);

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
