import Link from "next/link"
import { ArrowRight, Car as CarIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StageTimeline } from "./stage-timeline"
import {
  BUYER_STAGES,
  SELLER_STAGES,
  type Deal,
  formatByn,
} from "@/lib/mock-data"

interface Props {
  deal: Deal
  perspective: "buyer" | "seller"
}

const STATUS_MAP = {
  draft: { label: "Черновик", className: "bg-muted text-muted-foreground" },
  active: { label: "В работе", className: "bg-primary/10 text-primary" },
  signed: { label: "Подписана", className: "bg-accent/15 text-accent" },
  completed: { label: "Завершена", className: "bg-accent/15 text-accent" },
  rejected: { label: "Отклонена", className: "bg-destructive/10 text-destructive" },
} as const

export function DealCard({ deal, perspective }: Props) {
  const status = STATUS_MAP[deal.status]
  const stages = perspective === "buyer" ? BUYER_STAGES : SELLER_STAGES
  const current = perspective === "buyer" ? deal.currentBuyerStage : deal.currentSellerStage
  const href = `/${perspective}/deal/${deal.id}`

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <CarIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {deal.car.make} {deal.car.model}, {deal.car.year}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">{deal.shortId}</p>
          </div>
        </div>
        <Badge className={`rounded-full border-0 ${status.className}`}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Стоимость</p>
          <p className="font-semibold">{formatByn(deal.priceByn)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Аванс</p>
          <p className="font-semibold">{formatByn(deal.advanceByn)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Платёж / мес.</p>
          <p className="font-semibold">{formatByn(deal.monthlyByn)}</p>
        </div>
      </div>

      <div className="px-5 pb-4">
        <StageTimeline stages={stages} current={current} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t bg-muted/20 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {perspective === "buyer" ? deal.seller.name : deal.buyer.name}
        </p>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
          <Link href={href}>
            Перейти в сделку
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
