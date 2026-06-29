import React from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md',
        className
      )}
      {...props}
    />
  );
}
