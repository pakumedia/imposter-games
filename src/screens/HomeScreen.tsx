import { useState, useEffect, useCallback } from 'react';
import { Flame, Gamepad2, User } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  AppShell, 
  TopBar, 
  HeroGameCard, 
  BottomNav,
} from '@/components/ui-kit';
import { Mascot } from '@/components/mascots';
import { CardColor } from '@/components/ui-kit/GameCard';
import impostorSecretWordBg from '@/assets/impostor-secret-word-bg.jpg';

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
  backgroundImage?: string;
  buttonVariant?: 'primary' | 'secondary' | 'dark' | 'orange';
}

const GAMES: GameInfo[] = [
  {
    id: 'impostor',
    title: 'Impostor Secret Word',
    subtitle: 'Find the liar • 3-10 Players',
    color: 'dark',
    mascotVariant: 'yellow',
    onlineCount: 1247,
    backgroundImage: impostorSecretWordBg,
    buttonVariant: 'orange',
  },
  {
    id: 'impostor-drawing',
    title: 'Impostor Drawing',
    subtitle: 'Fake Artist • 4-8 Players',
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
  const [activeNav, setActiveNav] = useState('games');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

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

        {/* Game Cards Carousel - Embla */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 px-6">
            {GAMES.map((game) => (
              <div 
                key={game.id} 
                className="flex-none w-[80vw] max-w-[340px]"
              >
                <HeroGameCard
                  title={game.title}
                  subtitle={game.subtitle}
                  color={game.color}
                  onlineCount={game.onlineCount}
                  backgroundImage={game.backgroundImage}
                  buttonVariant={game.buttonVariant}
                  mascot={!game.backgroundImage ? <Mascot variant={game.mascotVariant} size="lg" /> : undefined}
                  onPlay={() => onSelectGame(game.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots - clickable */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {GAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'rounded-full transition-all duration-300 tap-scale',
                index === selectedIndex 
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
    </AppShell>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
