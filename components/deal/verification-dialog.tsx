"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, ShieldCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VerificationStep {
  source: string
  label: string
  /** override result (for demo). defaults to "pass" */
  result?: "pass" | "fail"
  /** delay before this step resolves (ms). defaults to random 800–1800 */
  delayMs?: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  steps: VerificationStep[]
  onComplete?: (success: boolean) => void
}

type RunState = "pending" | "running" | "pass" | "fail"

export function VerificationDialog({
  open,
  onOpenChange,
  title = "Проверка государственных реестров",
  description = "Запрос выполняется автоматически — вмешательство не требуется.",
  steps,
  onComplete,
}: Props) {
  const [states, setStates] = useState<RunState[]>(() => steps.map(() => "pending"))

  useEffect(() => {
    if (!open) {
      setStates(steps.map(() => "pending"))
      return
    }
    let cancelled = false
    const run = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return
        setStates((prev) => {
          const next = [...prev]
          next[i] = "running"
          return next
        })
        const delay = steps[i].delayMs ?? 800 + Math.random() * 1000
        await new Promise((r) => setTimeout(r, delay))
        if (cancelled) return
        const res = steps[i].result ?? "pass"
        setStates((prev) => {
          const next = [...prev]
          next[i] = res
          return next
        })
      }
      await new Promise((r) => setTimeout(r, 400))
      if (!cancelled) {
        setStates((curr) => {
          const success = curr.every((s) => s === "pass")
          onComplete?.(success)
          return curr
        })
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [open, steps, onComplete])

  const allDone = states.every((s) => s === "pass" || s === "fail")
  const success = allDone && states.every((s) => s === "pass")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={cn(
              "mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl",
              allDone
                ? success
                  ? "bg-accent/15 text-accent"
                  : "bg-destructive/15 text-destructive"
                : "bg-primary/10 text-primary",
            )}
          >
            <ShieldCheck className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 py-2">
          {steps.map((s, i) => {
            const st = states[i]
            return (
              <li
                key={s.source}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  st === "pass" && "border-accent/40 bg-accent/5",
                  st === "fail" && "border-destructive/40 bg-destructive/5",
                  st === "running" && "border-primary/30 bg-primary/5",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full",
                      st === "pass" && "bg-accent text-accent-foreground",
                      st === "fail" && "bg-destructive text-destructive-foreground",
                      st === "running" && "bg-primary/10 text-primary",
                      st === "pending" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {st === "pass" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : st === "fail" ? (
                      <X className="h-3.5 w-3.5" />
                    ) : st === "running" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="text-[10px] font-semibold">{i + 1}</span>
                    )}
                  </span>
                  <span className="font-medium text-foreground">{s.label}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    st === "pass" && "text-accent",
                    st === "fail" && "text-destructive",
                    st === "running" && "text-primary",
                    st === "pending" && "text-muted-foreground",
                  )}
                >
                  {st === "pending"
                    ? "Ожидает"
                    : st === "running"
                    ? "Проверка…"
                    : st === "pass"
                    ? "Пройдено"
                    : "Ошибка"}
                </span>
              </li>
            )
          })}
        </ul>

        <DialogFooter>
          <Button disabled={!allDone} onClick={() => onOpenChange(false)} className="w-full">
            {allDone ? (success ? "Продолжить" : "Закрыть") : "Идёт проверка…"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
