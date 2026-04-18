"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  Car as CarIcon,
  CheckCircle2,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { StageTimeline } from "./stage-timeline"
import { StagePanel } from "./stage-panel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BUYER_STAGES,
  type BuyerStageKey,
  type Deal,
  formatByn,
  formatDateRu,
  MOCK_BUYER,
} from "@/lib/mock-data"

interface Props {
  deal: Deal
}

export function BuyerDealWorkspace({ deal }: Props) {
  const [current, setCurrent] = useState<BuyerStageKey>(deal.currentBuyerStage)

  const currentStage = useMemo(
    () => BUYER_STAGES.find((s) => s.key === current)!,
    [current],
  )
  const currentIndex = BUYER_STAGES.findIndex((s) => s.key === current)

  const goNext = () => {
    const next = BUYER_STAGES[currentIndex + 1]
    if (!next) {
      toast.success("Все этапы пройдены!")
      return
    }
    setCurrent(next.key)
    toast.success(`Переход к этапу: ${next.title}`)
  }

  const goPrev = () => {
    const prev = BUYER_STAGES[currentIndex - 1]
    if (prev) setCurrent(prev.key)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="buyer" userName={MOCK_BUYER.name} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Top row: back + title + meta */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
              <Link href="/buyer" aria-label="К списку сделок">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {deal.car.make} {deal.car.model}
                </h1>
                <Badge variant="secondary" className="rounded-full font-mono text-xs">
                  {deal.shortId}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {deal.car.year} · {deal.car.color} · {deal.car.mileageKm.toLocaleString("ru-RU")} км · VIN {deal.car.vin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <Badge className="rounded-full border-0 bg-primary/10 text-primary">
              {currentStage.title}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Обновлено {formatDateRu(deal.updatedAt)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mt-5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Ход сделки</p>
              <p className="text-xs text-muted-foreground">
                Этап {currentIndex + 1} из {BUYER_STAGES.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={goNext} className="gap-1">
                Далее
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <StageTimeline stages={BUYER_STAGES} current={current} onSelect={(k) => setCurrent(k as BuyerStageKey)} />
        </Card>

        {/* Main + side */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Stage panel */}
          <StagePanel deal={deal} currentStage={current} onContinue={goNext} />

          {/* Side column */}
          <aside className="space-y-5">
            {/* Car summary */}
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src={deal.car.photo || "/placeholder.svg"}
                  alt={`${deal.car.make} ${deal.car.model}`}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <CarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {deal.car.make} {deal.car.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{deal.car.bodyType} · {deal.car.year}</p>
                  </div>
                </div>
                <Separator />
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Стоимость</dt>
                    <dd className="font-semibold">{formatByn(deal.priceByn)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Аванс (20%)</dt>
                    <dd className="font-semibold">{formatByn(deal.advanceByn)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Срок</dt>
                    <dd className="font-semibold">{deal.termMonths} мес.</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ежемесячно</dt>
                    <dd className="font-semibold text-accent">{formatByn(deal.monthlyByn)}</dd>
                  </div>
                </dl>
              </div>
            </Card>

            {/* Seller */}
            <Card className="p-5">
              <p className="text-sm font-semibold">Продавец</p>
              <p className="mt-2 text-sm">{deal.seller.name}</p>
              <p className="text-xs text-muted-foreground">УНП {deal.seller.inn}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Чат
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Calendar className="h-4 w-4" />
                  Встреча
                </Button>
              </div>
            </Card>

            {/* Timeline events */}
            <Card className="p-5">
              <p className="text-sm font-semibold">История событий</p>
              <ol className="mt-3 space-y-3">
                {deal.timeline.slice(0, 5).map((ev) => (
                  <li key={ev.id} className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{ev.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateRu(ev.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Quick docs */}
            <Card className="p-5">
              <p className="text-sm font-semibold">Документы</p>
              <ul className="mt-3 space-y-2">
                {["ДФЛ — Договор лизинга", "Полис КАСКО", "ДКП продавца", "Акт приёма-передачи"].map((d) => (
                  <li key={d}>
                    <button className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{d}</span>
                      <span className="text-xs text-muted-foreground">PDF</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
