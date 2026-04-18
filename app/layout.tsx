import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AutoLease — онлайн-лизинг подержанных автомобилей в Беларуси",
  description:
    "Полностью онлайн-оформление финансового лизинга б/у автомобилей между покупателем и продавцом. Проверки МСИ, БКИ, ФСЗН, Minjust. Подписание через электронную подпись.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0b1a3a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
