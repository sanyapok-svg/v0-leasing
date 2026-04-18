import { cn } from "@/lib/utils"

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
          <path d="M3 13l2-6h14l2 6v6h-2v-2H5v2H3v-6z" strokeLinejoin="round" />
          <circle cx="7.5" cy="15.5" r="1.2" fill="currentColor" />
          <circle cx="16.5" cy="15.5" r="1.2" fill="currentColor" />
          <path d="M9 10h6" strokeLinecap="round" />
        </svg>
      </div>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">AutoLease</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Беларусь
          </span>
        </div>
      )}
    </div>
  )
}
