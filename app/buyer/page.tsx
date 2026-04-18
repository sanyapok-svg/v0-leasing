"use client"

import Link from "next/link"
import { ArrowRight, Car, FileText, Plus, TrendingUp, Wallet } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { DealCard } from "@/components/deal/deal-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_BUYER, MOCK_DEALS, formatByn } from "@/lib/mock-data"

export default function BuyerDashboard() {
  const active = MOCK_DEALS.filter((d) => d.status === "active")
  const completed = MOCK_DEALS.filter((d) => d.status === "completed")

  const activeSum = active.reduce((s, d) => s + d.priceByn, 0)
  const monthlySum = active.reduce((s, d) => s + d.monthlyByn, 0)

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="buyer" userName={MOCK_BUYER.name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Greeting */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Добро пожаловать</p>
            <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {MOCK_BUYER.name.split(" ")[1]}, что оформляем сегодня?
            </h1>
          </div>
          <Button asChild size="lg" className="gap-2 self-start sm:self-end">
            <Link href="/buyer/deal/new">
              <Plus className="h-4 w-4" />
              Начать новую сделку
            </Link>
          </Button>
        </div>

        {/* KPI row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Активные сделки</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Car className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{active.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              На сумму {formatByn(activeSum)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Платёж в месяц</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{formatByn(monthlySum)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Всего по активным договорам</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">ПДН</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold text-accent">78</p>
            <p className="mt-1 text-xs text-muted-foreground">Одобрено к лизингу</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Завершённых сделок</p>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold">{completed.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Документы в архиве</p>
          </Card>
        </div>

        {/* Active deals */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Мои активные сделки</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Нажмите карточку, чтобы продолжить с того места, где остановились.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {active.length} в работе
            </Badge>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {active.map((d) => (
              <DealCard key={d.id} deal={d} perspective="buyer" />
            ))}
          </div>
        </section>

        {/* Completed deals */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Завершённые сделки</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="#">
                Все документы
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {completed.map((d) => (
              <DealCard key={d.id} deal={d} perspective="buyer" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
