"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  MoreHorizontal,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  MOCK_ADMIN,
  MOCK_DEALS,
  BUYER_STAGES,
  formatByn,
  formatDateRu,
  type Deal,
} from "@/lib/mock-data"

const STATUS_OPTIONS = [
  { value: "all", label: "Все статусы" },
  { value: "active", label: "В работе" },
  { value: "completed", label: "Завершённые" },
  { value: "rejected", label: "Отклонённые" },
  { value: "draft", label: "Черновики" },
] as const

const STATUS_META: Record<Deal["status"], { label: string; className: string }> = {
  draft: { label: "Черновик", className: "bg-muted text-muted-foreground" },
  active: { label: "В работе", className: "bg-primary/10 text-primary" },
  signed: { label: "Подписана", className: "bg-accent/15 text-accent" },
  completed: { label: "Завершена", className: "bg-accent/15 text-accent" },
  rejected: { label: "Отклонена", className: "bg-destructive/10 text-destructive" },
}

export default function AdminPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("all")

  const filtered = MOCK_DEALS.filter((d) => {
    if (status !== "all" && d.status !== status) return false
    if (!query) return true
    const q = query.toLowerCase()
    return (
      d.shortId.toLowerCase().includes(q) ||
      d.buyer.name.toLowerCase().includes(q) ||
      d.seller.name.toLowerCase().includes(q) ||
      `${d.car.make} ${d.car.model}`.toLowerCase().includes(q) ||
      d.car.vin.toLowerCase().includes(q)
    )
  })

  const totalSum = MOCK_DEALS.reduce((s, d) => s + d.priceByn, 0)
  const activeCount = MOCK_DEALS.filter((d) => d.status === "active").length
  const doneCount = MOCK_DEALS.filter((d) => d.status === "completed").length

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="admin" userName={MOCK_ADMIN.name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Панель администратора</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Все сделки платформы
          </h1>
        </div>

        {/* KPI */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Всего сделок"
            value={String(MOCK_DEALS.length)}
            icon={Users}
            tone="primary"
          />
          <Kpi
            label="В работе"
            value={String(activeCount)}
            icon={TrendingUp}
            tone="primary"
          />
          <Kpi
            label="Завершённых"
            value={String(doneCount)}
            icon={CheckCircle2}
            tone="accent"
          />
          <Kpi label="Оборот" value={formatByn(totalSum)} icon={Wallet} tone="accent" />
        </div>

        {/* Filters + table */}
        <Card className="mt-8 p-0">
          <div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по ID, VIN, ФИО, модели…"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Экспорт
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Автомобиль</TableHead>
                  <TableHead>Покупатель</TableHead>
                  <TableHead>Продавец</TableHead>
                  <TableHead>Этап</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Обновлено</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const stage = BUYER_STAGES.find((s) => s.key === d.currentBuyerStage)
                  const st = STATUS_META[d.status]
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {d.shortId}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {d.car.make} {d.car.model}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {d.car.year} · {d.car.color}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.buyer.name}</TableCell>
                      <TableCell className="text-sm">{d.seller.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {stage?.short ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        {formatByn(d.priceByn)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-full border-0 ${st.className}`}>
                          {st.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateRu(d.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/buyer/deal/${d.id}`}
                                className="flex items-center justify-between gap-2"
                              >
                                Открыть (покупатель)
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/seller/deal/${d.id}`}
                                className="flex items-center justify-between gap-2"
                              >
                                Открыть (продавец)
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Перевести этап</DropdownMenuItem>
                            <DropdownMenuItem>Скачать документы</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              Отменить сделку
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                      По заданным фильтрам сделок не найдено
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  )
}

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tone: "primary" | "accent"
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div
          className={
            tone === "accent"
              ? "grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent"
              : "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"
          }
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </Card>
  )
}
