"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSignature,
  Hourglass,
  KeyRound,
  QrCode,
  ShieldCheck,
  UploadCloud,
  Wallet,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { StageTimeline } from "./stage-timeline"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MsiSignDialog } from "./msi-sign-dialog"
import { VerificationDialog, type VerificationStep } from "./verification-dialog"
import {
  MOCK_SELLER,
  SELLER_STAGES,
  type Deal,
  type SellerStageKey,
  formatByn,
  formatDateRu,
} from "@/lib/mock-data"

interface Props {
  deal: Deal
}

export function SellerDealWorkspace({ deal }: Props) {
  const [current, setCurrent] = useState<SellerStageKey>(deal.currentSellerStage)
  const [msiOpen, setMsiOpen] = useState(false)
  const [msiDoc, setMsiDoc] = useState("Документ")
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifySteps, setVerifySteps] = useState<VerificationStep[]>([])

  const currentIndex = SELLER_STAGES.findIndex((s) => s.key === current)
  const currentStage = useMemo(
    () => SELLER_STAGES.find((s) => s.key === current)!,
    [current],
  )

  const goNext = () => {
    const next = SELLER_STAGES[currentIndex + 1]
    if (!next) {
      toast.success("Все этапы пройдены!")
      return
    }
    setCurrent(next.key)
    toast.success(`Переход к этапу: ${next.title}`)
  }

  const openMsi = (name: string) => {
    setMsiDoc(name)
    setMsiOpen(true)
  }

  const openVerify = (steps: VerificationStep[]) => {
    setVerifySteps(steps)
    setVerifyOpen(true)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AppHeader role="seller" userName={MOCK_SELLER.name} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Button asChild variant="ghost" size="icon" className="mt-0.5">
              <Link href="/seller" aria-label="К списку продаж">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Продажа {deal.car.make} {deal.car.model}
                </h1>
                <Badge variant="secondary" className="rounded-full font-mono text-xs">
                  {deal.shortId}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Покупатель: {deal.buyer.name} · УНП {deal.buyer.inn}
              </p>
            </div>
          </div>

          <Badge className="rounded-full border-0 bg-primary/10 text-primary">
            {currentStage.title}
          </Badge>
        </div>

        {/* Timeline */}
        <Card className="mt-5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Этап {currentIndex + 1} из {SELLER_STAGES.length}
            </p>
            <Button size="sm" onClick={goNext} className="gap-1">
              Далее
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <StageTimeline
            stages={SELLER_STAGES}
            current={current}
            onSelect={(k) => setCurrent(k as SellerStageKey)}
          />
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {current === "incoming" && (
              <PanelShell icon={Hourglass} title="Запрос от платформы">
                <p className="text-sm text-muted-foreground">
                  Покупатель {deal.buyer.name} оформляет авто в лизинг. Платформа уточнит детали по авто
                  и сделке — проверьте условия и примите решение.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <KV label="Цена покупателя" value={formatByn(deal.priceByn)} />
                  <KV label="Форма оплаты" value="Авторассрочка перечислит после акта" />
                </div>
                <div className="mt-5 flex gap-2 sm:justify-end">
                  <Button variant="outline" className="gap-1">
                    <XCircle className="h-4 w-4" />
                    Отклонить
                  </Button>
                  <Button onClick={goNext} className="gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Принять в работу
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "msi_seller" && (
              <PanelShell icon={KeyRound} title="МСИ продавца">
                <p className="text-sm text-muted-foreground">
                  Идентификация через МСИ — нужна для выплаты и подписания документов.
                </p>
                <Button
                  className="mt-5 gap-2"
                  onClick={() => openMsi("Идентификация продавца через МСИ")}
                >
                  Пройти МСИ
                </Button>
              </PanelShell>
            )}

            {current === "seller_checks" && (
              <PanelShell icon={ShieldCheck} title="Проверки" tone="accent">
                <p className="text-sm text-muted-foreground">
                  Автоматические проверки по реестрам перед подтверждением сделки.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    "Legat — право собственности",
                    "Minjust — отсутствие залогов",
                    "ГАИ — ограничения и штрафы",
                    "ПОД/ФТ — отсутствие санкций",
                  ].map((x) => (
                    <li
                      key={x}
                      className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      openVerify([
                        { source: "legat", label: "Legat — собственность" },
                        { source: "minjust", label: "Minjust — залоги" },
                        { source: "pdd", label: "ГАИ — ПДД" },
                        { source: "pod_ft", label: "ПОД/ФТ — скрининг" },
                      ])
                    }
                  >
                    Перезапустить
                  </Button>
                  <Button onClick={goNext} className="gap-1">
                    Продолжить
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "confirm_terms" && (
              <PanelShell icon={UploadCloud} title="Подтверждение и данные">
                <p className="text-sm text-muted-foreground">
                  Подтвердите сделку и передайте запрошенные данные по авто (фото, документы).
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <KV label="Цена" value={formatByn(deal.priceByn)} />
                  <KV label="Срок ответа" value="до 24 часов" />
                  <KV label="Фото" value="0 / 10" />
                </div>
                <div className="mt-4 rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                  <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Перетащите файлы или</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Выбрать файлы
                  </Button>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={goNext} className="gap-1">
                    Подтвердить условия
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "sign_dkp" && (
              <PanelShell icon={FileSignature} title="ДКП">
                <p className="text-sm text-muted-foreground">
                  После аванса покупателя готов договор купли-продажи (ДКП) — подпишите через МСИ.
                </p>
                <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
                  <FileSignature className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">ДКП-{deal.shortId}</p>
                    <p className="text-xs text-muted-foreground">8 страниц · PDF</p>
                  </div>
                  <Button size="sm" onClick={() => openMsi(`ДКП-${deal.shortId}`)}>
                    Подписать через МСИ
                  </Button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={goNext} variant="ghost" className="gap-1">
                    Далее
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "qr_inspection" && (
              <PanelShell icon={QrCode} title="QR для покупателя" tone="accent">
                <p className="text-sm text-muted-foreground">
                  На встрече откройте QR в приложении платформы — покупатель отсканирует и подтвердит
                  получение авто.
                </p>
                <div className="mt-5 flex flex-col items-center rounded-xl border bg-background p-6">
                  <div className="grid h-56 w-56 place-items-center rounded-lg border-2 border-foreground/10 bg-white">
                    <QrCodePattern />
                  </div>
                  <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
                    SESSION-{deal.shortId.replace("AL-", "")}
                  </p>
                </div>
                <div className="mt-5 flex gap-2 sm:justify-end">
                  <Button variant="outline">Отправить QR в чат</Button>
                  <Button onClick={goNext} className="gap-1">
                    Покупатель отсканировал
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "inspection_done" && (
              <PanelShell icon={CheckCircle2} title="Осмотр" tone="accent">
                <p className="text-sm text-muted-foreground">
                  Покупатель отсканировал QR. Далее — акт приёма-передачи к ДКП.
                </p>
                <div className="mt-4 flex justify-end">
                  <Button onClick={goNext} className="gap-1">
                    К подписанию акта
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "sign_act" && (
              <PanelShell icon={FileSignature} title="Акт к ДКП">
                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
                  <FileSignature className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Акт приёма-передачи к ДКП</p>
                    <p className="text-xs text-muted-foreground">
                      Подпишите — покупатель получит уведомление и сможет забрать ключи
                    </p>
                  </div>
                  <Button size="sm" onClick={() => openMsi("Акт приёма-передачи")}>
                    Подписать
                  </Button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={goNext} className="gap-1">
                    Далее
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "payout" && (
              <PanelShell icon={Wallet} title="Выплата за авто" tone="accent">
                <p className="text-sm text-muted-foreground">
                  Перечисление {formatByn(deal.priceByn)} на ваш счёт — в течение одного банковского дня
                  после подписания актов.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <KV label="К получению" value={formatByn(deal.priceByn)} accent />
                  <KV label="Реквизиты" value="BY12 BPS0 … 1234" mono />
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={goNext} className="gap-1">
                    Завершить сделку
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </PanelShell>
            )}

            {current === "complete" && (
              <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-background p-8 sm:p-12">
                <div className="flex flex-col items-center text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
                    Сделка закрыта
                  </h2>
                  <p className="mt-3 max-w-lg text-pretty text-muted-foreground">
                    Выплата по графику банка. Документы — в архиве кабинета.
                  </p>
                  <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                    <Button>Скачать документы (ZIP)</Button>
                    <Button asChild variant="outline">
                      <Link href="/seller">В личный кабинет</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Side */}
          <aside className="space-y-5">
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src={deal.car.photo || "/placeholder.svg"}
                  alt={`${deal.car.make} ${deal.car.model}`}
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm font-semibold">
                  {deal.car.make} {deal.car.model}
                </p>
                <Separator />
                <dl className="space-y-2 text-sm">
                  <Row dt="VIN" dd={deal.car.vin} mono />
                  <Row dt="Год" dd={String(deal.car.year)} />
                  <Row dt="Пробег" dd={`${deal.car.mileageKm.toLocaleString("ru-RU")} км`} />
                  <Row dt="Цена" dd={formatByn(deal.priceByn)} accent />
                </dl>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold">Покупатель</p>
              <p className="mt-2 text-sm">{deal.buyer.name}</p>
              <p className="text-xs text-muted-foreground">УНП {deal.buyer.inn}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {deal.buyer.phone}
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Открыть чат
              </Button>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold">История</p>
              <ol className="mt-3 space-y-3">
                {deal.timeline.map((e) => (
                  <li key={e.id} className="flex gap-3 text-sm">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateRu(e.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </aside>
        </div>
      </main>

      <MsiSignDialog
        open={msiOpen}
        onOpenChange={setMsiOpen}
        documentName={msiDoc}
        onComplete={() => toast.success("Подписано")}
      />

      <VerificationDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        steps={verifySteps}
        onComplete={(ok) => ok && toast.success("Проверки пройдены")}
      />
    </div>
  )
}

/* ---- helpers ---- */

function PanelShell({
  icon: Icon,
  title,
  children,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
  tone?: "primary" | "accent"
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div
          className={
            tone === "accent"
              ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"
              : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
          }
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </Card>
  )
}

function KV({
  label,
  value,
  accent,
  mono,
}: {
  label: string
  value: string
  accent?: boolean
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          (accent ? "text-accent" : "text-foreground") +
          " mt-0.5 font-semibold " +
          (mono ? "font-mono text-sm tracking-tight" : "text-sm")
        }
      >
        {value}
      </p>
    </div>
  )
}

function Row({ dt, dd, mono, accent }: { dt: string; dd: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{dt}</dt>
      <dd
        className={
          (accent ? "text-accent" : "text-foreground") +
          " font-semibold " +
          (mono ? "font-mono text-xs tracking-tight" : "")
        }
      >
        {dd}
      </dd>
    </div>
  )
}

/** Simple decorative QR pattern (not a real QR). */
function QrCodePattern() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    // Deterministic pseudo-random pattern
    const x = i % 21
    const y = Math.floor(i / 21)
    // Always draw finder patterns in corners
    const inFinder = (ax: number, ay: number) =>
      ax < 7 && ay < 7 && (ax === 0 || ax === 6 || ay === 0 || ay === 6 || (ax >= 2 && ax <= 4 && ay >= 2 && ay <= 4))
    const finder =
      inFinder(x, y) ||
      inFinder(x - 14, y) ||
      inFinder(x, y - 14)
    // Pseudo-random fill based on position
    const noise = ((x * 131 + y * 17 + x * y * 7) % 7) < 3
    return finder || (noise && x > 7 && y > 7 && x < 14 && y < 14) || (noise && (x + y) % 3 === 0)
  })

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: "repeat(21, 1fr)", width: "95%", height: "95%", gap: 0 }}
    >
      {cells.map((filled, i) => (
        <span
          key={i}
          className={filled ? "bg-foreground" : "bg-white"}
          style={{ aspectRatio: "1 / 1" }}
        />
      ))}
    </div>
  )
}
