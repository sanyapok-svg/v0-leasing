"use client"

import { useState } from "react"
import {
  ArrowRight,
  Car as CarIcon,
  CheckCircle2,
  FileSignature,
  Handshake,
  Hourglass,
  KeyRound,
  QrCode,
  ScanLine,
  Sparkles,
  UploadCloud,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MsiSignDialog } from "./msi-sign-dialog"
import { VerificationDialog, type VerificationStep } from "./verification-dialog"
import { type BuyerStageKey, type Deal, formatByn } from "@/lib/mock-data"

interface Props {
  deal: Deal
  currentStage: BuyerStageKey
  onContinue: () => void
}

export function StagePanel({ deal, currentStage, onContinue }: Props) {
  const [msiOpen, setMsiOpen] = useState(false)
  const [msiDocName, setMsiDocName] = useState("Документ")
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifySteps, setVerifySteps] = useState<VerificationStep[]>([])
  const [verifyTitle, setVerifyTitle] = useState("Проверка")

  const openMsi = (docName: string) => {
    setMsiDocName(docName)
    setMsiOpen(true)
  }

  const openVerify = (title: string, steps: VerificationStep[]) => {
    setVerifyTitle(title)
    setVerifySteps(steps)
    setVerifyOpen(true)
  }

  return (
    <div className="space-y-5">
      {currentStage === "application" && <StageApplication onContinue={onContinue} deal={deal} />}

      {currentStage === "msi_buyer" && (
        <StageMsiBuyer
          onStart={() => openMsi("Согласие на обработку и МСИ-идентификация покупателя")}
          onContinue={onContinue}
        />
      )}

      {currentStage === "pdn" && (
        <StagePdn
          onStart={() =>
            openVerify("Расчёт платёжеспособности (ПДН)", [
              { source: "bki", label: "БКИ — кредитная история" },
              { source: "fszn", label: "ФСЗН — подтверждение дохода" },
              { source: "pod_ft", label: "ПОД/ФТ — скрининг" },
            ])
          }
          onContinue={onContinue}
          deal={deal}
        />
      )}

      {currentStage === "car_check" && (
        <StageCarCheck
          onStart={() =>
            openVerify("Проверка автомобиля", [
              { source: "minjust", label: "Minjust.gov.by — реестр залогов" },
              { source: "pdd", label: "ГАИ — ограничения и ПДД" },
              { source: "pod_ft", label: "ПОД/ФТ — чистота сделки" },
            ])
          }
          onContinue={onContinue}
        />
      )}

      {currentStage === "application_form" && <StageApplicationForm onContinue={onContinue} deal={deal} />}

      {currentStage === "seller_response" && <StageSellerResponse onContinue={onContinue} deal={deal} />}

      {currentStage === "approval" && <StageApproval onContinue={onContinue} deal={deal} />}

      {currentStage === "sign_dfl" && (
        <StageSignDfl
          onSignDfl={() => openMsi("Договор финансового лизинга (ДФЛ)")}
          onSignKasko={() => openMsi("Полис КАСКО")}
          onContinue={onContinue}
        />
      )}

      {currentStage === "advance" && <StageAdvance onContinue={onContinue} deal={deal} />}

      {currentStage === "inspection" && <StageInspection onContinue={onContinue} />}

      {currentStage === "sign_act" && (
        <StageSignAct
          onSign={() => openMsi("Акт приёма-передачи к ДФЛ")}
          onContinue={onContinue}
        />
      )}

      {currentStage === "complete" && <StageComplete deal={deal} />}

      <MsiSignDialog
        open={msiOpen}
        onOpenChange={setMsiOpen}
        documentName={msiDocName}
        onComplete={() => {
          toast.success("Документ успешно подписан через МСИ")
        }}
      />

      <VerificationDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        title={verifyTitle}
        steps={verifySteps}
        onComplete={(ok) => {
          if (ok) toast.success("Все проверки пройдены")
        }}
      />
    </div>
  )
}

/* -------- Individual stage panels -------- */

function StageShell({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
  tone?: "primary" | "accent"
}) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div
          className={
            tone === "accent"
              ? "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"
              : "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
          }
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-balance text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </Card>
  )
}

function StageApplication({ onContinue, deal }: { onContinue: () => void; deal: Deal }) {
  return (
    <StageShell
      icon={CarIcon}
      eyebrow="Этап 1"
      title="Регистрация и данные по авто"
      description="Проверьте авто и цену — далее идентификация и согласия на расчёт."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoTile label="Автомобиль" value={`${deal.car.make} ${deal.car.model}, ${deal.car.year}`} />
        <InfoTile label="VIN" value={deal.car.vin} mono />
        <InfoTile label="Пробег" value={`${deal.car.mileageKm.toLocaleString("ru-RU")} км`} />
        <InfoTile label="Стоимость" value={formatByn(deal.priceByn)} accent />
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={onContinue} className="gap-2">
          Далее: МСИ и согласия
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageMsiBuyer({ onStart, onContinue }: { onStart: () => void; onContinue: () => void }) {
  const [agree1, setAgree1] = useState(true)
  const [agree2, setAgree2] = useState(true)
  const [agree3, setAgree3] = useState(true)
  const all = agree1 && agree2 && agree3

  return (
    <StageShell
      icon={KeyRound}
      eyebrow="Этап 2"
      title="МСИ и согласия"
      description="Идентификация и согласия, нужные для расчёта и проверок."
    >
      <div className="space-y-3">
        <ConsentRow
          checked={agree1}
          onChange={setAgree1}
          id="c1"
          title="Согласие на обработку персональных данных"
          body="Мы используем ваши данные исключительно для расчёта лизинга и отправки в государственные реестры."
        />
        <ConsentRow
          checked={agree2}
          onChange={setAgree2}
          id="c2"
          title="Согласие на запрос в БКИ"
          body="Кредитное бюро вернёт обобщённую долговую нагрузку для расчёта ПДН."
        />
        <ConsentRow
          checked={agree3}
          onChange={setAgree3}
          id="c3"
          title="Согласие на запрос в ФСЗН"
          body="Подтверждаем источник и размер дохода за последние 12 месяцев."
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onContinue}>
          Пропустить (демо)
        </Button>
        <Button size="lg" disabled={!all} onClick={onStart} className="gap-2">
          Начать идентификацию
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StagePdn({
  onStart,
  onContinue,
  deal,
}: {
  onStart: () => void
  onContinue: () => void
  deal: Deal
}) {
  const score = deal.pdnScore ?? 78
  const verdict = deal.pdnVerdict ?? "green"
  return (
    <StageShell
      icon={Sparkles}
      eyebrow="Этап 3"
      title="Расчёт и согласие"
      description="Получите расчёт по лизингу. Если условия подходят — подтвердите согласие на продолжение."
      tone="accent"
    >
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Ваш показатель ПДН</p>
          <p className="mt-1 text-5xl font-semibold text-foreground">
            {score}
            <span className="text-2xl font-medium text-muted-foreground"> / 100</span>
          </p>
          <Progress
            value={score}
            className="mt-4 h-2 [&>*]:bg-accent"
            aria-label="ПДН"
          />
          <p className="mt-3 text-sm">
            <span
              className={
                verdict === "green"
                  ? "inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent"
                  : verdict === "yellow"
                  ? "inline-flex items-center gap-1 rounded-full bg-chart-3/15 px-2.5 py-1 text-xs font-medium text-chart-3"
                  : "inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive"
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {verdict === "green" && "Одобрено к финансированию"}
              {verdict === "yellow" && "Ограниченно одобрено"}
              {verdict === "red" && "Требуется ручная проверка"}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:w-64">
          <Button onClick={onStart} variant="outline" className="w-full">
            Перезапросить проверки
          </Button>
          <Button onClick={onContinue} className="w-full gap-2">
            Продолжить
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </StageShell>
  )
}

function StageCarCheck({ onStart, onContinue }: { onStart: () => void; onContinue: () => void }) {
  const items = [
    { label: "Minjust.gov.by — залоги и ограничения", ok: true },
    { label: "ГАИ — штрафы и регистрация", ok: true },
    { label: "ПОД/ФТ — чистота происхождения", ok: true },
    { label: "VIN — история владельцев", ok: true },
  ]
  return (
    <StageShell
      icon={ScanLine}
      eyebrow="Этап 4"
      title="Проверка автомобиля"
      description="Проверяем авто по реестрам. После ответа продавца проверка дополняется его данными."
    >
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {items.map((i) => (
          <li
            key={i.label}
            className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
            <span className="font-medium">{i.label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2 sm:justify-end">
        <Button variant="outline" onClick={onStart}>
          Запустить повторно
        </Button>
        <Button onClick={onContinue} className="gap-2">
          Условия лизинга
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageApplicationForm({ onContinue, deal }: { onContinue: () => void; deal: Deal }) {
  return (
    <StageShell
      icon={UploadCloud}
      eyebrow="Этап 5"
      title="Условия лизинга"
      description="Аванс, срок и платёж — при необходимости скорректируйте перед отправкой запроса."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoTile label="Сумма лизинга" value={formatByn(deal.priceByn)} />
        <InfoTile label="Аванс" value={formatByn(deal.advanceByn)} accent />
        <InfoTile label="Срок" value={`${deal.termMonths} мес.`} />
        <InfoTile label="Процентная ставка" value="14,5%" />
        <InfoTile label="Остаточная стоимость" value="5%" />
        <InfoTile label="Ежемесячный платёж" value={formatByn(deal.monthlyByn)} accent />
      </div>
      <Separator className="my-6" />
      <div className="rounded-lg border bg-muted/40 p-4 text-sm">
        <p className="font-medium">К заявке будут приложены:</p>
        <ul className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
          <li>• Копия паспорта (получена по МСИ)</li>
          <li>• Справка ФСЗН (получена автоматически)</li>
          <li>• VIN-отчёт (сформирован)</li>
          <li>• Согласия (подписаны)</li>
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={onContinue} className="gap-2">
          Отправить — свяжемся с продавцом
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageSellerResponse({ onContinue, deal }: { onContinue: () => void; deal: Deal }) {
  return (
    <StageShell
      icon={Hourglass}
      eyebrow="Этап 6"
      title="Связь с продавцом"
      description={`Обращаемся к продавцу (${deal.seller.name}) за деталями по авто и сделке. Ждём подтверждения и данные.`}
    >
      <div className="flex items-center gap-4 rounded-lg border bg-muted/40 p-5">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10">
          <Hourglass className="h-7 w-7 animate-pulse text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Заявка #{deal.shortId} на рассмотрении</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Уведомим, когда продавец ответит и передаст данные для проверки авто.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline">Открыть чат с продавцом</Button>
        <Button onClick={onContinue} className="gap-2">
          Смоделировать ответ (демо)
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageApproval({ onContinue, deal }: { onContinue: () => void; deal: Deal }) {
  return (
    <StageShell
      icon={CheckCircle2}
      eyebrow="Этап 7"
      title="ДФЛ и КАСКО"
      description="Продавец подтвердил сделку, авто проверен. Формируем договор лизинга (ДФЛ) и КАСКО."
      tone="accent"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoTile label="Сумма лизинга" value={formatByn(deal.priceByn)} />
        <InfoTile label="Платёж в месяц" value={formatByn(deal.monthlyByn)} accent />
        <InfoTile label="Срок" value={`${deal.termMonths} мес.`} />
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={onContinue} className="gap-2">
          К подписанию ДФЛ и КАСКО
          <FileSignature className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageSignDfl({
  onSignDfl,
  onSignKasko,
  onContinue,
}: {
  onSignDfl: () => void
  onSignKasko: () => void
  onContinue: () => void
}) {
  return (
    <StageShell
      icon={FileSignature}
      eyebrow="Этап 8"
      title="Подпись ДФЛ и КАСКО"
      description="Подпишите ДФЛ и полис КАСКО через МСИ."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <DocumentSignRow
          title="Договор финансового лизинга"
          subtitle="ДФЛ-24019 · 12 страниц"
          onSign={onSignDfl}
        />
        <DocumentSignRow
          title="Полис КАСКО"
          subtitle="КАСКО-24019 · включён в платёж"
          onSign={onSignKasko}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue} className="gap-2">
          Аванс по сделке
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageAdvance({ onContinue, deal }: { onContinue: () => void; deal: Deal }) {
  return (
    <StageShell
      icon={Wallet}
      eyebrow="Этап 9"
      title="Аванс"
      description="После оплаты аванса сформируем ДКП для продавца. Дальше — согласование встречи и осмотра."
    >
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Сумма к оплате</p>
          <p className="mt-1 text-5xl font-semibold">{formatByn(deal.advanceByn)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Реквизиты: Авторассрочка · BY86ALFA30122 0000 0000 0000 · АЛЬФА-БАНК
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="gap-2">
              <Wallet className="h-4 w-4" />
              Оплатить в ЕРИП
            </Button>
            <Button variant="outline">Скачать счёт (PDF)</Button>
          </div>
        </div>
        <div className="grid h-40 w-40 place-items-center rounded-2xl border bg-muted/40">
          <QrCode className="h-24 w-24 text-foreground/80" />
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex justify-end">
        <Button onClick={onContinue} className="gap-2">
          Подтвердить оплату (демо)
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageInspection({ onContinue }: { onContinue: () => void }) {
  return (
    <StageShell
      icon={ScanLine}
      eyebrow="Этап 10"
      title="Встреча и осмотр"
      description="После подписания ДКП продавцом договоритесь о встрече. Осмотрите авто; затем попросите открыть QR в приложении платформы."
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <ol className="space-y-3 text-sm">
            {[
              "Согласуйте время и место встречи",
              "Проверьте авто, VIN и пробег",
              "Продавец открывает QR в приложении — вы сканируете своим",
              "Подтверждаете готовность получить авто — формируется акт к ДФЛ",
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button className="gap-2">
              <ScanLine className="h-4 w-4" />
              Открыть сканер камеры
            </Button>
            <Button variant="outline" onClick={onContinue}>
              Подтвердить осмотр (демо)
            </Button>
          </div>
        </div>
        <div className="grid h-48 w-48 place-items-center rounded-2xl border-2 border-dashed bg-muted/40">
          <div className="text-center">
            <ScanLine className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">Область сканирования</p>
          </div>
        </div>
      </div>
    </StageShell>
  )
}

function StageSignAct({ onSign, onContinue }: { onSign: () => void; onContinue: () => void }) {
  return (
    <StageShell
      icon={Handshake}
      eyebrow="Этап 11"
      title="Акт к ДФЛ"
      description="Подпишите акт приёма-передачи к ДФЛ. Для продавца параллельно оформляется акт к ДКП — дождитесь уведомления о его подписи, затем можно забирать ключи."
    >
      <DocumentSignRow
        title="Акт приёма-передачи автомобиля"
        subtitle="Акт к ДФЛ · 2 стр."
        onSign={onSign}
      />
      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue} className="gap-2">
          Переход к ключам и регистрации
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </StageShell>
  )
}

function StageComplete({ deal }: { deal: Deal }) {
  return (
    <Card className="overflow-hidden border-accent/40 bg-gradient-to-br from-accent/5 to-background p-8 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <Badge variant="secondary" className="mt-4 rounded-full">
          {deal.shortId}
        </Badge>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Ключи у вас
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          {deal.car.make} {deal.car.model} — сделка закрыта. Продавец получит оплату в течение одного
          банковского дня. После постановки авто на учёт в ГАИ загрузите в сервис копию техпаспорта.
        </p>

        <div className="mt-8 grid w-full max-w-md gap-3">
          <Button size="lg" variant="outline" className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Загрузить копию техпаспорта
          </Button>
          <Button size="lg" className="gap-2">
            <FileSignature className="h-4 w-4" />
            Скачать пакет документов (ZIP)
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <a href="/buyer">
              В личный кабинет
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* -------- Helpers -------- */

function InfoTile({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string
  value: string
  mono?: boolean
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          (accent ? "text-accent" : "text-foreground") +
          " mt-1 text-base font-semibold " +
          (mono ? "font-mono tracking-tight" : "")
        }
      >
        {value}
      </p>
    </div>
  )
}

function ConsentRow({
  id,
  title,
  body,
  checked,
  onChange,
}: {
  id: string
  title: string
  body: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
      <div className="flex-1">
        <Label htmlFor={id} className="cursor-pointer text-sm font-semibold">
          {title}
        </Label>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </label>
  )
}

function DocumentSignRow({
  title,
  subtitle,
  onSign,
}: {
  title: string
  subtitle: string
  onSign: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <FileSignature className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Button size="sm" onClick={onSign} className="shrink-0 gap-1">
        <FileSignature className="h-4 w-4" />
        Подписать
      </Button>
    </div>
  )
}
