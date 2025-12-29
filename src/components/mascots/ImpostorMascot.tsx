import { cn } from '@/lib/utils';

interface ImpostorMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-20 h-28',
  md: 'w-32 h-44',
  lg: 'w-40 h-56',
};

export function ImpostorMascot({ size = 'md', className = '' }: ImpostorMascotProps) {
  return (
    <svg 
      viewBox="0 0 120 170" 
      className={cn(sizeClasses[size], className)}
      fill="none"
    >
      {/* Body - dark mysterious */}
      <ellipse cx="60" cy="110" rx="40" ry="50" fill="#2D2D2D" />
      
      {/* Hoodie/cloak shape */}
      <path 
        d="M 20 80 Q 20 40 60 35 Q 100 40 100 80 L 100 130 Q 60 145 20 130 Z" 
        fill="#1A1A1A"
      />
      
      {/* Inner shadow */}
      <ellipse cx="60" cy="100" rx="30" ry="35" fill="#0D0D0D" fillOpacity="0.5" />
      
      {/* Glowing eyes */}
      <ellipse cx="45" cy="75" rx="10" ry="12" fill="#FF4D4D" />
      <ellipse cx="75" cy="75" rx="10" ry="12" fill="#FF4D4D" />
      
      {/* Eye inner glow */}
      <ellipse cx="45" cy="75" rx="5" ry="6" fill="#FF8080" />
      <ellipse cx="75" cy="75" rx="5" ry="6" fill="#FF8080" />
      
      {/* Eye shine */}
      <circle cx="48" cy="72" r="2" fill="white" fillOpacity="0.8" />
      <circle cx="78" cy="72" r="2" fill="white" fillOpacity="0.8" />
      
      {/* Sinister smile */}
      <path 
        d="M 45 100 Q 60 115 75 100" 
        stroke="#FF4D4D" 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Hands/claws */}
      <ellipse cx="15" cy="110" rx="10" ry="15" fill="#2D2D2D" />
      <ellipse cx="105" cy="110" rx="10" ry="15" fill="#2D2D2D" />
      
      {/* Feet */}
      <ellipse cx="40" cy="155" rx="15" ry="10" fill="#2D2D2D" />
      <ellipse cx="80" cy="155" rx="15" ry="10" fill="#2D2D2D" />
      
      {/* Mysterious aura */}
      <ellipse cx="60" cy="100" rx="55" ry="65" fill="url(#auraGradient)" fillOpacity="0.3" />
      
      <defs>
        <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF4D4D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
