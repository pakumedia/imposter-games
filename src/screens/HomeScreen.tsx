import { useState } from 'react';
import { Gamepad2, User } from 'lucide-react';
import { 
  AppShell, 
  TopBar, 
  HeroGameCard, 
  BottomNav,
  CurvedCarousel,
} from '@/components/ui-kit';
import { Mascot } from '@/components/mascots';
import { CardColor } from '@/components/ui-kit/GameCard';
import { ProfileScreen } from './ProfileScreen';
import impostorSecretWordBg from '@/assets/impostor-secret-word-bg.png';
import impostorDrawingBg from '@/assets/impostor-drawing-bg.png';
import impostorCharadesBg from '@/assets/impostor-charades-bg.png';

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
  backgroundVideo?: string;
  buttonVariant?: 'primary' | 'secondary' | 'dark' | 'orange' | 'skyblue';
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
    backgroundImage: impostorDrawingBg,
    buttonVariant: 'skyblue',
  },
  {
    id: 'impostor-charades',
    title: 'Impostor Charades',
    subtitle: 'Act it out • 4-10 Players',
    color: 'purple',
    mascotVariant: 'purple',
    onlineCount: 634,
    backgroundImage: impostorCharadesBg,
    buttonVariant: 'primary',
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
  { id: 'games', icon: <Gamepad2 className="w-5 h-5" /> },
  { id: 'profile', icon: <User className="w-5 h-5" /> },
];

export function HomeScreen({ onSelectGame }: HomeScreenProps) {
  const [activeNav, setActiveNav] = useState('games');
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (activeNav === 'profile') {
    return (
      <>
        <ProfileScreen />
        <BottomNav
          items={NAV_ITEMS}
          activeId={activeNav}
          onSelect={setActiveNav}
        />
      </>
    );
  }

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
        <div className="screen-padding mt-4 mb-4">
          <h1 className="text-h1 text-foreground leading-tight">
            Pick Game<br />To Play
          </h1>
        </div>

        {/* 3D Curved Carousel */}
        <CurvedCarousel
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        >
          {GAMES.map((game) => (
            <HeroGameCard
              key={game.id}
              title={game.title}
              subtitle={game.subtitle}
              color={game.color}
              onlineCount={game.onlineCount}
              backgroundImage={game.backgroundImage}
              backgroundVideo={game.backgroundVideo}
              buttonVariant={game.buttonVariant}
              mascot={!game.backgroundImage && !game.backgroundVideo ? <Mascot variant={game.mascotVariant} size="lg" /> : undefined}
              onPlay={() => onSelectGame(game.id)}
            />
          ))}
        </CurvedCarousel>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        items={NAV_ITEMS}
        activeId={activeNav}
        onSelect={setActiveNav}
      />
    </AppShell>
  );
}
