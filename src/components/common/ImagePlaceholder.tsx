import { cn } from '@/utils/cn';

interface ImagePlaceholderProps {
  className?: string;
}

export function ImagePlaceholder({ className }: ImagePlaceholderProps) {
  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium", className)}>
      Image Placeholder
    </div>
  );
}
