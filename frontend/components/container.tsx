import { cn } from "@/lib/utils";

export default function Container({size, children, className}: {size: 'sm' | 'md' | 'lg' | 'xl' | 'full', className?: string, children: React.ReactNode}) {
  return (
    <div className={
      cn(
        'w-full mx-auto',
        size === 'sm' && 'max-w-(--breakpoint-sm)',
        size === 'md' && 'max-w-(--breakpoint-md)',
        size === 'lg' && 'max-w-(--breakpoint-lg)',
        size === 'xl' && 'max-w-(--breakpoint-xl)',
        size === 'full' && 'max-w-full',
        className
      )
    }>
      {children}
    </div>
  )
}