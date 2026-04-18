"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Car as CarIcon, Search, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MOCK_BUYER, MOCK_DEALS } from "@/lib/mock-data"

export default function NewDealPage() {
  const router = useRouter()
  const [vin, setVin] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success("Автомобиль найден — открываем сделку")
      router.push(`/buyer/deal/${MOCK_DEALS[0].id}`)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="buyer" userName={MOCK_BUYER.name} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/buyer">
            <ArrowLeft className="h-4 w-4" />
            К дашборду
          </Link>
        </Button>

        <div className="mt-4">
          <Badge variant="secondary" className="rounded-full">
            Новая сделка
          </Badge>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Выберите автомобиль
          </h1>
          <p className="mt-2 text-muted-foreground">
            Укажите VIN автомобиля, и мы подтянем данные из ГАИ автоматически.
          </p>
        </div>

        <Card className="mt-6 p-6">
          <Label htmlFor="vin" className="text-sm font-medium">
            VIN-номер автомобиля
          </Label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="WVWZZZ3CZKE123456"
                className="pl-9 font-mono uppercase"
                maxLength={17}
              />
            </div>
            <Button onClick={handleStart} disabled={loading} className="gap-2">
              {loading ? "Поиск…" : "Найти"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            VIN состоит из 17 символов. Пример — для демо оставьте поле пустым или введите любой.
          </p>
        </Card>

        <Card className="mt-4 border-dashed p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Не знаете VIN?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Попросите продавца отправить VIN через чат или сфотографируйте табличку в
                моторном отсеке. Мы подскажем, где именно.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <p className="text-sm font-semibold">Популярные модели в лизинг</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {MOCK_DEALS.slice(0, 3).map((d) => (
              <Card
                key={d.id}
                className="cursor-pointer p-4 transition-colors hover:border-primary/40"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <CarIcon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {d.car.make} {d.car.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {d.car.year} · {d.car.mileageKm.toLocaleString("ru-RU")} км
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 h-auto p-0 text-xs"
                  onClick={() => router.push(`/buyer/deal/${d.id}`)}
                >
                  Открыть сделку →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
