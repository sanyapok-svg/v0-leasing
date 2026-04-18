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
import { Progress } from "@/components/ui/progress"
import { Check, ShieldCheck, Smartphone, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "idle" | "connecting" | "waiting" | "signing" | "done"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  documentName?: string
  description?: string
  onComplete?: () => void
}

const PHASES: { key: Phase; label: string; progress: number }[] = [
  { key: "connecting", label: "Соединение с сервисом МСИ…", progress: 25 },
  { key: "waiting", label: "Ожидание подтверждения в приложении МСИ на вашем смартфоне", progress: 55 },
  { key: "signing", label: "Формирование электронной подписи…", progress: 85 },
  { key: "done", label: "Подпись успешно сформирована", progress: 100 },
]

export function MsiSignDialog({
  open,
  onOpenChange,
  title = "Подписание через МСИ",
  documentName = "Документ",
  description = "Подтвердите операцию в мобильном приложении МСИ.",
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle")
  const progress = PHASES.find((p) => p.key === phase)?.progress ?? 0
  const label = PHASES.find((p) => p.key === phase)?.label

  useEffect(() => {
    if (!open) {
      setPhase("idle")
      return
    }
    let cancelled = false
    const run = async () => {
      const steps: Phase[] = ["connecting", "waiting", "signing", "done"]
      const delays = [900, 2000, 1200, 600]
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return
        setPhase(steps[i])
        await new Promise((r) => setTimeout(r, delays[i]))
      }
      if (!cancelled) onComplete?.()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [open, onComplete])

  const timestamp = new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            {phase === "done" ? (
              <ShieldCheck className="h-7 w-7 text-accent" />
            ) : (
              <Smartphone className="h-7 w-7" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {phase === "done" ? "Подпись получена и зафиксирована в реестре." : description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <p className="font-medium text-foreground">{documentName}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              SHA-256: 3a7c…{Math.random().toString(16).slice(2, 8)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {phase === "done" ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              <span
                className={cn(
                  "font-medium",
                  phase === "done" ? "text-accent" : "text-foreground",
                )}
              >
                {label}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {phase === "done" && (
            <div className="space-y-1 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Время подписания:</span>
                <span className="font-mono font-medium">{timestamp}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Идентификатор:</span>
                <span className="font-mono font-medium">
                  MSI-{Math.random().toString(36).slice(2, 10).toUpperCase()}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={phase !== "done"}
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {phase === "done" ? "Готово" : "Ожидание подписи…"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
