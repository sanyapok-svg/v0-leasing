"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StageStatus } from "@/lib/mock-data"

export interface TimelineStage {
  key: string
  title: string
  short: string
}

interface Props {
  stages: readonly TimelineStage[]
  current: string
  onSelect?: (key: string) => void
  className?: string
}

export function StageTimeline({ stages, current, onSelect, className }: Props) {
  const currentIndex = stages.findIndex((s) => s.key === current)

  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-x-auto pb-2">
        <ol className="flex min-w-max items-start gap-0">
          {stages.map((stage, i) => {
            const status: StageStatus =
              i < currentIndex ? "done" : i === currentIndex ? "current" : "pending"
            const isLast = i === stages.length - 1
            return (
              <li key={stage.key} className="flex min-w-[100px] flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className="flex-1">
                    {i > 0 && (
                      <div
                        className={cn(
                          "h-[2px] w-full",
                          i <= currentIndex ? "bg-accent" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect?.(stage.key)}
                    className={cn(
                      "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-xs font-semibold transition-colors",
                      status === "done" &&
                        "border-accent bg-accent text-accent-foreground",
                      status === "current" &&
                        "border-primary bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/10",
                      status === "pending" &&
                        "border-border bg-background text-muted-foreground",
                    )}
                    aria-current={status === "current" ? "step" : undefined}
                  >
                    {status === "done" ? <Check className="h-4 w-4" /> : i + 1}
                    {status === "current" && (
                      <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-primary/30" />
                    )}
                  </button>
                  <div className="flex-1">
                    {!isLast && (
                      <div
                        className={cn(
                          "h-[2px] w-full",
                          i < currentIndex ? "bg-accent" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 w-full px-1 text-center">
                  <p
                    className={cn(
                      "text-[11px] font-medium leading-tight",
                      status === "current" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {stage.short}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
