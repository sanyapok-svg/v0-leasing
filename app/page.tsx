import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Building2,
  Users,
} from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { ProcessTimeline } from "@/components/landing/process-timeline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Как это работает
            </a>
            <a href="#cabinets" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Кабинеты
            </a>
            <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Безопасность
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Войти</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Начать сделку</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Финансовый лизинг · Беларусь
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Оформите лизинг <span className="text-primary">б/у автомобиля</span> полностью онлайн
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Авторассрочка позволяет вам приобрести автомобиль в несколько кликов, а платить за
                него частями. Без визита в офис финансовой компании.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/login">
                    Начать сделку
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#how">Как это работает</a>
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-6 border-t pt-8">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Сделок</dt>
                  <dd className="mt-1 text-2xl font-semibold text-foreground">12 480+</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Среднее время</dt>
                  <dd className="mt-1 text-2xl font-semibold text-foreground">
                    48<span className="text-base font-medium text-muted-foreground"> часов</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Одобрение</dt>
                  <dd className="mt-1 text-2xl font-semibold text-accent">97%</dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted shadow-sm">
                <Image
                  src="/hero-car.jpg"
                  alt="Автомобиль в рассрочку Авторассрочка"
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Floating status card */}
              <Card className="absolute -left-4 bottom-8 max-w-[240px] p-4 shadow-lg sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Проверка сделки</p>
                    <p className="font-semibold">78 / 100</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-accent" />
                </div>
                <p className="mt-2 text-xs text-accent">Одобрено к финансированию</p>
              </Card>
              <Card className="absolute -right-4 top-8 max-w-[220px] p-4 shadow-lg sm:-right-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">МСИ</p>
                    <p className="text-sm font-semibold">Подпись получена</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust / partners strip */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Интеграции с внешними сервисами и государственными реестрами
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {["МСИ", "БКИ", "ФСЗН", "Minjust", "ГАИ"].map((name) => (
                <div
                  key={name}
                  className="grid h-14 place-items-center rounded-lg border bg-background text-sm font-semibold tracking-wide text-muted-foreground"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="rounded-full">
                Процесс
              </Badge>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                От выбора авто до получения ключей 1 день
              </h2>
            </div>

            <ProcessTimeline />
          </div>
        </section>

        {/* Cabinets preview */}
        <section id="cabinets" className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="rounded-full">
                Роли
              </Badge>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Три кабинета — единый процесс сделки
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  role: "Покупатель",
                  href: "/buyer",
                  bullets: [
                    "Пошаговый таймлайн сделки",
                    "Расчёт, договоры ДФЛ и КАСКО, акты",
                    "Осмотр по QR у продавца",
                    "Загрузка техпаспорта после ГАИ",
                  ],
                },
                {
                  icon: Building2,
                  role: "Продавец",
                  href: "/seller",
                  bullets: [
                    "Запросы и подтверждение сделки",
                    "ДКП после аванса покупателя",
                    "QR для встречи с покупателем",
                    "Выплата за 1 банковский день",
                  ],
                },
                {
                  icon: ShieldCheck,
                  role: "Администратор",
                  href: "/admin",
                  bullets: [
                    "Все сделки с фильтрами",
                    "Ручное управление этапами",
                    "Мониторинг проверок",
                    "Документы и аудит",
                  ],
                },
              ].map((c) => (
                <Card key={c.role} className="flex flex-col p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Кабинет — {c.role}</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="mt-6 w-full">
                    <Link href={c.href} className="gap-1">
                      Открыть демо
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <Card className="overflow-hidden bg-primary p-0 text-primary-foreground">
              <div className="grid gap-6 p-10 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="text-balance text-3xl font-semibold tracking-tight">
                    Готовы оформить лизинг?
                  </h2>
                  <p className="mt-3 max-w-xl text-primary-foreground/80">
                    Войдите в демо-кабинет и пройдите полный цикл сделки от покупателя и продавца.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" variant="secondary" className="gap-2">
                    <Link href="/login">
                      Открыть кабинет
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © 2026 Авторассрочка. Демо-прототип. Не является публичной офертой.
          </p>
        </div>
      </footer>
    </div>
  )
}
