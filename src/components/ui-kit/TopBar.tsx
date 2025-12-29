import { ReactNode } from 'react';
import { IconButton } from './IconButton';
import { Coins } from 'lucide-react';

interface TopBarProps {
  avatarUrl?: string;
  username?: string;
  coins?: number;
  leftAction?: ReactNode;
  rightActions?: ReactNode;
}

export function TopBar({ 
  avatarUrl = '', 
  username = 'Player', 
  coins = 0,
  leftAction,
  rightActions 
}: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between screen-padding">
      <div className="flex items-center gap-3">
        {leftAction || (
          <div className="w-10 h-10 rounded-full bg-game-purple flex items-center justify-center overflow-hidden shadow-soft">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-foreground font-bold text-body">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
        <span className="font-bold text-body text-foreground">{username}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-card rounded-pill px-3 py-1.5 shadow-soft">
          <Coins className="w-4 h-4 text-game-yellow" />
          <span className="font-bold text-caption text-foreground">{coins}</span>
        </div>
        {rightActions}
      </div>
    </header>
  );
}
