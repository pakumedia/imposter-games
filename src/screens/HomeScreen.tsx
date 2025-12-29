import { useState, useRef } from 'react';
import { Home, Gamepad2, Trophy, Settings, Search, ShoppingBag } from 'lucide-react';
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
    subtitle: 'Pass & Play • 3-10 Players',
    color: 'orange',
    mascotVariant: 'yellow',
    onlineCount: 1247,
    isImpostor: true,
  },
  {
    id: 'trivia',
    title: 'Party Trivia',
    subtitle: 'Quiz Game • 2-8 Players',
    color: 'blue',
    mascotVariant: 'blue',
    onlineCount: 892,
  },
  {
    id: 'drawing',
    title: 'Quick Draw',
    subtitle: 'Drawing Game • 3-8 Players',
    color: 'purple',
    mascotVariant: 'purple',
    onlineCount: 634,
  },
  {
    id: 'words',
    title: 'Word Chain',
    subtitle: 'Word Game • 2-6 Players',
    color: 'pink',
    mascotVariant: 'pink',
    onlineCount: 421,
  },
  {
    id: 'truth',
    title: 'Truth or Dare',
    subtitle: 'Party Game • 2-12 Players',
    color: 'teal',
    mascotVariant: 'orange',
    onlineCount: 756,
  },
];

const NAV_ITEMS = [
  { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Home' },
  { id: 'games', icon: <Gamepad2 className="w-6 h-6" />, label: 'Games' },
  { id: 'ranks', icon: <Trophy className="w-6 h-6" />, label: 'Ranks' },
  { id: 'settings', icon: <Settings className="w-6 h-6" />, label: 'Settings' },
];

export function HomeScreen({ onSelectGame }: HomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth - 48; // Account for padding
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(Math.min(newIndex, GAMES.length - 1));
    }
  };

  return (
    <AppShell>
      {/* Top Bar */}
      <TopBar
        username="Guest"
        coins={250}
        rightActions={
          <>
            <IconButton variant="default" size="md">
              <ShoppingBag className="w-5 h-5" />
            </IconButton>
            <IconButton variant="default" size="md">
              <Search className="w-5 h-5" />
            </IconButton>
          </>
        }
      />

      {/* Main Content */}
      <main className="flex-1 pb-28 animate-fade-in">
        {/* Title */}
        <div className="screen-padding mt-4 mb-6">
          <h1 className="text-h1 text-foreground leading-tight">
            Pick Game<br />To Play
          </h1>
        </div>

        {/* Game Cards Carousel */}
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-4 touch-pan-x"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {GAMES.map((game) => (
            <div 
              key={game.id} 
              className="flex-shrink-0 w-[85vw] max-w-[360px] snap-center"
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
        </div>

        {/* Progress Dots */}
        <ProgressDots 
          total={GAMES.length} 
          current={currentSlide} 
          className="mt-4"
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        items={NAV_ITEMS}
        activeId={activeNav}
        onSelect={setActiveNav}
      />

      {/* Hide scrollbar styles */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AppShell>
  );
}
