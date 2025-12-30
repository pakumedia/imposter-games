import { cn } from '@/lib/utils';

interface FlagIconProps {
  country: 'de' | 'en' | 'gb';
  className?: string;
}

// SVG Flag components that render correctly on all devices
export function FlagIcon({ country, className }: FlagIconProps) {
  const flagClass = cn("w-6 h-6 rounded-sm overflow-hidden flex-shrink-0", className);
  
  if (country === 'de') {
    return (
      <svg viewBox="0 0 24 24" className={flagClass}>
        <rect width="24" height="8" fill="#000000" />
        <rect y="8" width="24" height="8" fill="#DD0000" />
        <rect y="16" width="24" height="8" fill="#FFCC00" />
      </svg>
    );
  }
  
  if (country === 'en' || country === 'gb') {
    return (
      <svg viewBox="0 0 24 24" className={flagClass}>
        {/* Blue background */}
        <rect width="24" height="24" fill="#012169" />
        {/* White diagonals */}
        <path d="M0,0 L24,24 M24,0 L0,24" stroke="#FFFFFF" strokeWidth="4" />
        {/* Red diagonals */}
        <path d="M0,0 L24,24 M24,0 L0,24" stroke="#C8102E" strokeWidth="2" />
        {/* White cross */}
        <path d="M12,0 V24 M0,12 H24" stroke="#FFFFFF" strokeWidth="6" />
        {/* Red cross */}
        <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="4" />
      </svg>
    );
  }
  
  return null;
}
