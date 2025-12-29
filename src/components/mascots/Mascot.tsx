import { cn } from '@/lib/utils';

interface MascotProps {
  variant: 'yellow' | 'blue' | 'purple' | 'pink' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-20 h-24',
  md: 'w-32 h-40',
  lg: 'w-40 h-48',
};

export function Mascot({ variant, size = 'md', className = '' }: MascotProps) {
  const colors = {
    yellow: { body: '#F6C84C', shadow: '#D4A933', cheek: '#FF9B9B' },
    blue: { body: '#77C7F2', shadow: '#5BA8D9', cheek: '#FFB5B5' },
    purple: { body: '#7B6CF6', shadow: '#5A4DD4', cheek: '#FFB5B5' },
    pink: { body: '#FF5E8A', shadow: '#D94A73', cheek: '#FFD4D4' },
    orange: { body: '#F2A64A', shadow: '#D48A33', cheek: '#FF9B9B' },
  };

  const c = colors[variant];

  return (
    <svg 
      viewBox="0 0 120 150" 
      className={cn(sizeClasses[size], className)}
      fill="none"
    >
      {/* Body */}
      <ellipse cx="60" cy="95" rx="45" ry="50" fill={c.body} />
      <ellipse cx="60" cy="100" rx="40" ry="42" fill={c.shadow} fillOpacity="0.3" />
      
      {/* Face area - lighter */}
      <ellipse cx="60" cy="80" rx="35" ry="32" fill={c.body} />
      
      {/* Eyes */}
      <ellipse cx="45" cy="75" rx="8" ry="10" fill="#1F1F1F" />
      <ellipse cx="75" cy="75" rx="8" ry="10" fill="#1F1F1F" />
      
      {/* Eye shine */}
      <circle cx="48" cy="72" r="3" fill="white" />
      <circle cx="78" cy="72" r="3" fill="white" />
      
      {/* Cheeks */}
      <ellipse cx="30" cy="88" rx="8" ry="5" fill={c.cheek} fillOpacity="0.6" />
      <ellipse cx="90" cy="88" rx="8" ry="5" fill={c.cheek} fillOpacity="0.6" />
      
      {/* Smile */}
      <path 
        d="M 50 92 Q 60 100 70 92" 
        stroke="#1F1F1F" 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Arms */}
      <ellipse cx="20" cy="100" rx="12" ry="18" fill={c.body} />
      <ellipse cx="100" cy="100" rx="12" ry="18" fill={c.body} />
      
      {/* Feet */}
      <ellipse cx="40" cy="138" rx="15" ry="10" fill={c.body} />
      <ellipse cx="80" cy="138" rx="15" ry="10" fill={c.body} />
      
      {/* Top decoration - small tuft */}
      <ellipse cx="60" cy="35" rx="8" ry="12" fill={c.body} />
    </svg>
  );
}
