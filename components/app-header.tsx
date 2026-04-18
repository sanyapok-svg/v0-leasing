"use client"

import Link from "next/link"
import { Bell, LogOut } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Role } from "@/lib/mock-data"

interface Props {
  role: Role
  userName: string
  notifCount?: number
}

const ROLE_META: Record<Role, { label: string; href: string }> = {
  buyer: { label: "Покупатель", href: "/buyer" },
  seller: { label: "Продавец", href: "/seller" },
  admin: { label: "Администратор", href: "/admin" },
}

export function AppHeader({ role, userName, notifCount = 3 }: Props) {
  const { label, href } = ROLE_META[role]
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={href} className="flex items-center">
          <Logo />
        </Link>
        <Badge variant="secondary" className="hidden rounded-full font-medium sm:inline-flex">
          {label}
        </Badge>

        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Уведомления" className="relative">
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {notifCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{userName.split(" ")[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="truncate">{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">{label}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/buyer">Кабинет покупателя</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/seller">Кабинет продавца</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin">Админ-панель</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Выйти
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
