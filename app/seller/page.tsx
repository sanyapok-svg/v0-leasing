"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  XCircle,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  MOCK_DEALS,
  MOCK_SELLER,
  SELLER_STAGES,
  formatByn,
  formatDateRu,
  type Deal,
} from "@/lib/mock-data"

export default function SellerDashboard() {
  const incoming = MOCK_DEALS.filter((d) => d.currentSellerStage === "confirm_terms")
  const inProgress = MOCK_DEALS.filter(
    (d) =>
      d.status === "active" &&
      d.currentSellerStage !== "confirm_terms" &&
      d.currentSellerStage !== "complete",
  )
  const completed = MOCK_DEALS.filter((d) => d.status === "completed")

  const incomingSum = incoming.reduce((s, d) => s + d.priceByn, 0)

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="seller" userName={MOCK_SELLER.name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Кабинет продавца</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {MOCK_SELLER.name.split(" ")[0]}, управляйте продажами
          </h1>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Входящие запросы</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{incoming.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              На сумму {formatByn(incomingSum)}
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Сделки в работе</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{inProgress.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Ожидают ваших действий</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Завершено в этом году</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{completed.length + 12}</p>
            <p className="mt-1 text-xs text-muted-foreground">Средний чек: 52 400 BYN</p>
          </Card>
        </div>

        <Tabs defaultValue="incoming" className="mt-10">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="incoming">
                Входящие
                <Badge variant="secondary" className="ml-2 rounded-full px-1.5">
                  {incoming.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="progress">
                В работе
                <Badge variant="secondary" className="ml-2 rounded-full px-1.5">
                  {inProgress.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="done">Завершённые</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="incoming" className="mt-6">
            <KanbanBoard deals={incoming} />
          </TabsContent>
          <TabsContent value="progress" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {inProgress.map((d) => (
                <SellerDealRow key={d.id} deal={d} />
              ))}
              {inProgress.length === 0 && <EmptyState label="Нет сделок в работе" />}
            </div>
          </TabsContent>
          <TabsContent value="done" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {completed.map((d) => (
                <SellerDealRow key={d.id} deal={d} />
              ))}
              {completed.length === 0 && <EmptyState label="Завершённых сделок пока нет" />}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function KanbanBoard({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) return <EmptyState label="Нет входящих запросов" />
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {deals.map((d) => (
        <IncomingCard key={d.id} deal={d} />
      ))}
    </div>
  )
}

function IncomingCard({ deal }: { deal: Deal }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/10] bg-muted">
        <Image
          src={deal.car.photo || "/placeholder.svg"}
          alt={`${deal.car.make} ${deal.car.model}`}
          fill
          sizes="400px"
          className="object-cover"
        />
        <Badge className="absolute left-3 top-3 rounded-full border-0 bg-primary/90 text-primary-foreground">
          Новый запрос
        </Badge>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div>
          <p className="text-sm font-semibold">
            {deal.car.make} {deal.car.model}, {deal.car.year}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{deal.shortId}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border bg-muted/40 p-2">
            <p className="text-[11px] text-muted-foreground">Цена</p>
            <p className="font-semibold">{formatByn(deal.priceByn)}</p>
          </div>
          <div className="rounded-md border bg-muted/40 p-2">
            <p className="text-[11px] text-muted-foreground">Покупатель</p>
            <p className="truncate font-semibold">{deal.buyer.name.split(" ")[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          Поступил {formatDateRu(deal.createdAt)}
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <XCircle className="h-4 w-4" />
            Отклонить
          </Button>
          <Button asChild size="sm" className="gap-1">
            <Link href={`/seller/deal/${deal.id}`}>
              <CheckCircle2 className="h-4 w-4" />
              Открыть
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

function SellerDealRow({ deal }: { deal: Deal }) {
  const stage = SELLER_STAGES.find((s) => s.key === deal.currentSellerStage)
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={deal.car.photo || "/placeholder.svg"}
            alt={`${deal.car.make} ${deal.car.model}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {deal.car.make} {deal.car.model}
          </p>
          <p className="font-mono text-xs text-muted-foreground">{deal.shortId}</p>
          <Badge variant="secondary" className="mt-1.5 rounded-full text-xs">
            {stage?.title}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatByn(deal.priceByn)}</p>
          <div className="mt-1 flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
              <Link href={`/seller/deal/${deal.id}`}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <Card className="border-dashed p-10 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  )
}
