import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export function Loader({ className, ...props }: React.SVGAttributes<SVGSVGElement>) {
  return (
    <Loader2
      className={cn('h-6 w-6 animate-spin text-primary', className)}
      {...props}
    />
  );
}
