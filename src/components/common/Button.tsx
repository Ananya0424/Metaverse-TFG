import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-hover shadow-md hover:shadow-lg': variant === 'secondary',
            'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900': variant === 'outline',
            'bg-transparent hover:bg-slate-100 text-slate-900': variant === 'ghost',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
