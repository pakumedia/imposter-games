import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className={`min-h-screen bg-background paper-texture ${className}`}>
      {/* Safe area spacer for notch */}
      <div className="w-full bg-background safe-area-top" />
      <div className="relative z-10 min-h-screen flex flex-col safe-bottom">
        {children}
      </div>
    </div>
  );
}
