import { AppShell, GameCard, PillButton, GameHeader } from '@/components/ui-kit';
import { GalleryCanvas } from '@/components/drawing';
import { useDrawingStore } from '@/game/drawing-store';
import { MessageCircle, Palette } from 'lucide-react';

interface DrawingGalleryScreenProps {
  onStartDiscussion: () => void;
  onExit?: () => void;
}

export function DrawingGalleryScreen({ onStartDiscussion, onExit }: DrawingGalleryScreenProps) {
  const { lines, players, secretWord, category } = useDrawingStore();

  return (
    <AppShell>
      <GameHeader onExit={onExit} />
      <div className="flex-1 flex flex-col items-center screen-padding py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-game-blue/10 rounded-pill px-4 py-2 mb-3">
            <Palette className="w-4 h-4 text-game-blue" />
            <span className="text-caption font-bold text-game-blue">Masterpiece Complete!</span>
          </div>
          <h1 className="text-h2 text-foreground">The Drawing</h1>
          <p className="text-body text-muted-foreground mt-1">
            The word was: <span className="font-bold">{category} → {secretWord}</span>
          </p>
        </div>

        {/* Canvas display */}
        <GameCard color="white" className="p-4 mb-6">
          <GalleryCanvas lines={lines} size={320} />
        </GameCard>

        {/* Player colors legend */}
        <div className="w-full max-w-sm mb-8">
          <h3 className="text-caption text-muted-foreground mb-3 text-center">Artist Colors</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map(player => (
              <div 
                key={player.id}
                className="flex items-center gap-2 bg-card rounded-pill px-3 py-1.5 shadow-soft"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: player.drawingColor }}
                />
                <span className="text-caption font-medium text-foreground">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discussion button */}
        <div className="w-full max-w-sm">
          <PillButton
            variant="primary"
            fullWidth
            icon={<MessageCircle className="w-5 h-5" />}
            onClick={onStartDiscussion}
          >
            Start Discussion
          </PillButton>
          <p className="text-center text-caption text-muted-foreground mt-3">
            Discuss who you think the Fake Artist is!
          </p>
        </div>
      </div>
    </AppShell>
  );
}
