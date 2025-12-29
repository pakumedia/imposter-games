import { useRef, useEffect, useCallback } from 'react';
import { DrawingLine } from '@/game/drawing-types';

interface GalleryCanvasProps {
  lines: DrawingLine[];
  highlightPlayerId?: string;
  size?: number;
}

export function GalleryCanvas({
  lines,
  highlightPlayerId,
  size = 300,
}: GalleryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all lines
    lines.forEach(line => {
      if (line.points.length < 2) return;
      
      ctx.beginPath();
      
      // Highlight impostor's lines
      if (highlightPlayerId && line.playerId === highlightPlayerId) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = line.strokeWidth + 2;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.strokeWidth;
        ctx.setLineDash([]);
      }
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }, [lines, highlightPlayerId]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-card bg-card shadow-card"
    />
  );
}
