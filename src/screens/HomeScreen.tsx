import { useState } from 'react';
import { Flame, Gamepad2, User } from 'lucide-react';
import { 
  AppShell, 
  TopBar, 
  HeroGameCard, 
  ProgressDots, 
  BottomNav,
  IconButton
} from '@/components/ui-kit';
import { Mascot, ImpostorMascot } from '@/components/mascots';
import { CardColor } from '@/components/ui-kit/GameCard';

interface HomeScreenProps {
  onSelectGame: (gameId: string) => void;
}

interface GameInfo {
  id: string;
  title: string;
  subtitle: string;
  color: CardColor;
  mascotVariant: 'yellow' | 'blue' | 'purple' | 'pink' | 'orange';
  onlineCount: number;
  isImpostor?: boolean;
}

const GAMES: GameInfo[] = [
  {
    id: 'impostor',
    title: 'Impostor Secret Word',
    subtitle: 'Find the liar • 3-10 Players',
    color: 'orange',
    mascotVariant: 'yellow',
    onlineCount: 1247,
    isImpostor: true,
  },
  {
    id: 'impostor-drawing',
    title: 'Impostor Drawing',
    subtitle: 'Draw without knowing • 4-8 Players',
    color: 'blue',
    mascotVariant: 'blue',
    onlineCount: 892,
  },
  {
    id: 'impostor-charades',
    title: 'Impostor Charades',
    subtitle: 'Act it out • 4-10 Players',
    color: 'purple',
    mascotVariant: 'purple',
    onlineCount: 634,
  },
  {
    id: 'impostor-sounds',
    title: 'Impostor Sounds',
    subtitle: 'Make the noise • 3-8 Players',
    color: 'pink',
    mascotVariant: 'pink',
    onlineCount: 421,
  },
  {
    id: 'impostor-questions',
    title: 'Odd One Out',
    subtitle: 'Answer differently • 4-12 Players',
    color: 'teal',
    mascotVariant: 'orange',
    onlineCount: 756,
  },
];

const NAV_ITEMS = [
  { id: 'hot', icon: <Flame className="w-5 h-5" /> },
  { id: 'games', icon: <Gamepad2 className="w-5 h-5" /> },
  { id: 'profile', icon: <User className="w-5 h-5" /> },
];

export function HomeScreen({ onSelectGame }: HomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeNav, setActiveNav] = useState('games');

  const scrollToCard = (index: number) => {
    const container = document.getElementById('game-carousel');
    if (container) {
      const cardWidth = container.children[0]?.clientWidth || 300;
      container.scrollTo({
        left: index * (cardWidth + 16), // 16 = gap
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const cardWidth = container.children[0]?.clientWidth || 300;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / (cardWidth + 16));
    if (newIndex !== currentSlide && newIndex >= 0 && newIndex < GAMES.length) {
      setCurrentSlide(newIndex);
    }
  };

  return (
    <AppShell>
      {/* Top Bar */}
      <TopBar
        username="Guest"
        coins={250}
      />

      {/* Main Content */}
      <main className="flex-1 pb-28 animate-fade-in overflow-hidden">
        {/* Title */}
        <div className="screen-padding mt-4 mb-6">
          <h1 className="text-h1 text-foreground leading-tight">
            Pick Game<br />To Play
          </h1>
        </div>

        {/* Game Cards Carousel */}
        <div 
          id="game-carousel"
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-scroll snap-x snap-mandatory px-6 pb-4"
          style={{ 
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {GAMES.map((game, index) => (
            <div 
              key={game.id} 
              className="flex-none w-[80vw] max-w-[340px] snap-center"
            >
              <HeroGameCard
                title={game.title}
                subtitle={game.subtitle}
                color={game.color}
                onlineCount={game.onlineCount}
                mascot={
                  game.isImpostor ? (
                    <ImpostorMascot size="lg" />
                  ) : (
                    <Mascot variant={game.mascotVariant} size="lg" />
                  )
                }
                onPlay={() => onSelectGame(game.id)}
              />
            </div>
          ))}
          {/* End spacer for last card */}
          <div className="flex-none w-4" />
        </div>

        {/* Progress Dots - clickable */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {GAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={cn(
                'rounded-full transition-all duration-300 tap-scale',
                index === currentSlide 
                  ? 'w-6 h-2 bg-foreground' 
                  : 'w-2 h-2 bg-foreground/20 hover:bg-foreground/40'
              )}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation - Clean 3-icon style */}
      <BottomNav
        items={NAV_ITEMS}
        activeId={activeNav}
        onSelect={setActiveNav}
      />

      {/* Hide scrollbar */}
      <style>{`
        #game-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AppShell>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
