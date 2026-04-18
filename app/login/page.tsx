import Link from "next/link"
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, Users } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const roles = [
    {
      icon: Users,
      title: "Покупатель",
      description:
        "Подберите автомобиль, пройдите проверки и оформите лизинг за 12 шагов.",
      href: "/buyer",
      cta: "Войти как покупатель",
    },
    {
      icon: Building2,
      title: "Продавец",
      description:
        "Принимайте запросы, подтверждайте условия и получайте оплату онлайн.",
      href: "/seller",
      cta: "Войти как продавец",
    },
    {
      icon: ShieldCheck,
      title: "Администратор",
      description:
        "Управляйте всеми сделками платформы и контролируйте этапы.",
      href: "/admin",
      cta: "Войти как администратор",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              На главную
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <Badge variant="secondary" className="rounded-full">
            Демо-режим
          </Badge>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Выберите, как войти
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            В демо-версии авторизация через МСИ выключена. Выберите роль, чтобы
            сразу перейти в соответствующий кабинет с подготовленными сделками.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.title} className="flex flex-col p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{r.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
              <Button asChild className="mt-6 gap-2">
                <Link href={r.href}>
                  {r.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Настоящий вход — через МСИ</p>
              <p className="mt-1 text-sm text-muted-foreground">
                В продакшене вход выполняется через межбанковскую систему идентификации:
                вы подтверждаете операцию в мобильном приложении МСИ, и AutoLease получает
                ваш ФИО, УНП и контакты из государственного реестра.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
