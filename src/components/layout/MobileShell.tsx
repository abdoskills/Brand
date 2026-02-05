import clsx from "clsx";
import { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-gradient-to-br from-street-black via-background-dark to-black px-0 lg:px-6">
      <div
        className={clsx(
          "relative flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-x border-neutral-800 bg-background-dark shadow-2xl transition-all duration-300 md:max-w-2xl lg:max-w-5xl lg:overflow-visible lg:rounded-3xl lg:border lg:border-white/10 lg:bg-background-dark/80 lg:shadow-[0_40px_100px_rgba(0,0,0,0.55)] lg:backdrop-blur-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
