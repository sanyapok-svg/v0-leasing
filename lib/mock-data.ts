// Domain types for AutoLease.
// NOTE: These shapes mirror a future Supabase schema (users, deals, cars, documents, stage_events)
// so the app can be rewired from in-memory mocks to real tables with minimal changes.

export type Role = "buyer" | "seller" | "admin"

export type StageStatus = "pending" | "current" | "done" | "blocked"

/** 12 stages from the buyer's perspective (mirror of Описание.docx, Часть 1 + Часть 2). */
export const BUYER_STAGES = [
  { key: "application", title: "Начало сделки", short: "Заявка" },
  { key: "msi_buyer", title: "МСИ-верификация покупателя", short: "МСИ" },
  { key: "pdn", title: "Проверка платёжеспособности (ПДН)", short: "ПДН" },
  { key: "car_check", title: "Проверка автомобиля", short: "Авто" },
  { key: "application_form", title: "Заполнение заявки", short: "Заявка" },
  { key: "seller_response", title: "Ответ продавца", short: "Продавец" },
  { key: "approval", title: "Решение по сделке", short: "Решение" },
  { key: "sign_dfl", title: "Подписание ДФЛ и КАСКО", short: "ДФЛ" },
  { key: "advance", title: "Оплата аванса", short: "Аванс" },
  { key: "inspection", title: "Осмотр автомобиля", short: "Осмотр" },
  { key: "sign_act", title: "Подписание акта", short: "Акт" },
  { key: "complete", title: "Завершение сделки", short: "Готово" },
] as const

export type BuyerStageKey = (typeof BUYER_STAGES)[number]["key"]

/** 10 stages from the seller's perspective. */
export const SELLER_STAGES = [
  { key: "incoming", title: "Входящий запрос", short: "Запрос" },
  { key: "msi_seller", title: "МСИ-верификация продавца", short: "МСИ" },
  { key: "seller_checks", title: "Проверки продавца", short: "Проверки" },
  { key: "confirm_terms", title: "Подтверждение условий", short: "Условия" },
  { key: "sign_dkp", title: "Подписание ДКП", short: "ДКП" },
  { key: "qr_inspection", title: "QR-код для осмотра", short: "QR" },
  { key: "inspection_done", title: "Осмотр подтверждён", short: "Осмотр" },
  { key: "sign_act", title: "Подписание акта", short: "Акт" },
  { key: "payout", title: "Получение денег", short: "Оплата" },
  { key: "complete", title: "Сделка завершена", short: "Готово" },
] as const

export type SellerStageKey = (typeof SELLER_STAGES)[number]["key"]

export interface Car {
  id: string
  make: string
  model: string
  year: number
  vin: string
  mileageKm: number
  priceByn: number
  color: string
  bodyType: string
  photo: string
}

export interface Party {
  id: string
  name: string
  inn: string // УНП / ИНН
  phone: string
  email: string
  verified: boolean
}

export interface VerificationResult {
  source: "msi" | "bki" | "fszn" | "minjust" | "pod_ft" | "gai" | "legat" | "pdd"
  label: string
  status: "pass" | "fail" | "pending"
  checkedAt?: string
  details?: string
}

export interface Deal {
  id: string
  shortId: string
  car: Car
  buyer: Party
  seller: Party
  priceByn: number
  advanceByn: number
  monthlyByn: number
  termMonths: number
  currentBuyerStage: BuyerStageKey
  currentSellerStage: SellerStageKey
  status: "draft" | "active" | "signed" | "completed" | "rejected"
  checks: VerificationResult[]
  pdnScore?: number // 0–100
  pdnVerdict?: "green" | "yellow" | "red"
  createdAt: string
  updatedAt: string
  timeline: DealEvent[]
}

export interface DealEvent {
  id: string
  at: string
  actor: Role
  title: string
  description?: string
  icon?: "check" | "sign" | "upload" | "pay" | "scan" | "flag"
}

/** -------- Mock dataset -------- */

const today = new Date()
const iso = (offsetMin: number) => new Date(today.getTime() + offsetMin * 60_000).toISOString()

export const MOCK_BUYER: Party = {
  id: "u-buyer-1",
  name: "Ковалёв Андрей Сергеевич",
  inn: "3456789012345",
  phone: "+375 29 123-45-67",
  email: "a.kovalev@example.by",
  verified: true,
}

export const MOCK_SELLER: Party = {
  id: "u-seller-1",
  name: "Михайлов Пётр Иванович",
  inn: "2345678901234",
  phone: "+375 44 987-65-43",
  email: "p.mikhailov@example.by",
  verified: true,
}

export const MOCK_ADMIN: Party = {
  id: "u-admin-1",
  name: "Анна Петрова",
  inn: "—",
  phone: "+375 17 000-00-00",
  email: "admin@autolease.by",
  verified: true,
}

const car1: Car = {
  id: "car-1",
  make: "Volkswagen",
  model: "Passat B8",
  year: 2019,
  vin: "WVWZZZ3CZKE123456",
  mileageKm: 124_500,
  priceByn: 48_900,
  color: "Серебристый",
  bodyType: "Седан",
  photo: "/hero-car.jpg",
}

const car2: Car = {
  id: "car-2",
  make: "Toyota",
  model: "Camry",
  year: 2020,
  vin: "JT2BG22K0Y0449912",
  mileageKm: 89_300,
  priceByn: 62_400,
  color: "Чёрный",
  bodyType: "Седан",
  photo: "/hero-car.jpg",
}

const car3: Car = {
  id: "car-3",
  make: "Skoda",
  model: "Octavia A7",
  year: 2018,
  vin: "TMBJF7NE5J0123987",
  mileageKm: 156_700,
  priceByn: 34_800,
  color: "Белый",
  bodyType: "Лифтбек",
  photo: "/hero-car.jpg",
}

export const MOCK_DEALS: Deal[] = [
  {
    id: "deal-001",
    shortId: "AL-24019",
    car: car1,
    buyer: MOCK_BUYER,
    seller: MOCK_SELLER,
    priceByn: 48_900,
    advanceByn: 9_780,
    monthlyByn: 945,
    termMonths: 48,
    currentBuyerStage: "approval",
    currentSellerStage: "confirm_terms",
    status: "active",
    pdnScore: 78,
    pdnVerdict: "green",
    checks: [
      { source: "msi", label: "МСИ — идентификация", status: "pass", checkedAt: iso(-60 * 6) },
      { source: "bki", label: "БКИ — кредитная история", status: "pass", checkedAt: iso(-60 * 5) },
      { source: "fszn", label: "ФСЗН — подтверждение дохода", status: "pass", checkedAt: iso(-60 * 5) },
      { source: "minjust", label: "Minjust — реестр залогов", status: "pass", checkedAt: iso(-60 * 4) },
      { source: "pdd", label: "ГАИ — проверка ПДД", status: "pass", checkedAt: iso(-60 * 4) },
      { source: "pod_ft", label: "ПОД/ФТ — скрининг", status: "pass", checkedAt: iso(-60 * 4) },
    ],
    createdAt: iso(-60 * 24 * 3),
    updatedAt: iso(-60 * 2),
    timeline: [
      { id: "e1", at: iso(-60 * 24 * 3), actor: "buyer", title: "Сделка инициирована", icon: "flag" },
      { id: "e2", at: iso(-60 * 24 * 3 + 5), actor: "buyer", title: "МСИ-верификация пройдена", icon: "check" },
      { id: "e3", at: iso(-60 * 24 * 2), actor: "admin", title: "ПДН: 78/100 — зелёный", icon: "check" },
      { id: "e4", at: iso(-60 * 24), actor: "buyer", title: "Заявка отправлена продавцу", icon: "upload" },
      { id: "e5", at: iso(-60 * 4), actor: "seller", title: "Продавец открыл заявку", icon: "check" },
    ],
  },
  {
    id: "deal-002",
    shortId: "AL-24020",
    car: car2,
    buyer: MOCK_BUYER,
    seller: MOCK_SELLER,
    priceByn: 62_400,
    advanceByn: 12_480,
    monthlyByn: 1_280,
    termMonths: 48,
    currentBuyerStage: "inspection",
    currentSellerStage: "qr_inspection",
    status: "active",
    pdnScore: 64,
    pdnVerdict: "yellow",
    checks: [
      { source: "msi", label: "МСИ — идентификация", status: "pass", checkedAt: iso(-60 * 48) },
      { source: "bki", label: "БКИ — кредитная история", status: "pass", checkedAt: iso(-60 * 48) },
      { source: "fszn", label: "ФСЗН — подтверждение дохода", status: "pass", checkedAt: iso(-60 * 48) },
      { source: "minjust", label: "Minjust — реестр залогов", status: "pass", checkedAt: iso(-60 * 47) },
    ],
    createdAt: iso(-60 * 24 * 10),
    updatedAt: iso(-60 * 1),
    timeline: [
      { id: "e1", at: iso(-60 * 24 * 10), actor: "buyer", title: "Сделка инициирована", icon: "flag" },
      { id: "e2", at: iso(-60 * 24 * 9), actor: "buyer", title: "Оплачен аванс 12 480 BYN", icon: "pay" },
      { id: "e3", at: iso(-60 * 24 * 2), actor: "admin", title: "ДФЛ сформирован", icon: "sign" },
      { id: "e4", at: iso(-60 * 4), actor: "seller", title: "Сгенерирован QR для осмотра", icon: "scan" },
    ],
  },
  {
    id: "deal-003",
    shortId: "AL-23998",
    car: car3,
    buyer: MOCK_BUYER,
    seller: MOCK_SELLER,
    priceByn: 34_800,
    advanceByn: 6_960,
    monthlyByn: 720,
    termMonths: 48,
    currentBuyerStage: "complete",
    currentSellerStage: "complete",
    status: "completed",
    pdnScore: 82,
    pdnVerdict: "green",
    checks: [
      { source: "msi", label: "МСИ — идентификация", status: "pass" },
      { source: "bki", label: "БКИ — кредитная история", status: "pass" },
      { source: "fszn", label: "ФСЗН — подтверждение дохода", status: "pass" },
      { source: "minjust", label: "Minjust — реестр залогов", status: "pass" },
      { source: "gai", label: "ГАИ — регистрация авто", status: "pass" },
    ],
    createdAt: iso(-60 * 24 * 60),
    updatedAt: iso(-60 * 24 * 50),
    timeline: [
      { id: "e1", at: iso(-60 * 24 * 60), actor: "buyer", title: "Сделка инициирована", icon: "flag" },
      { id: "e2", at: iso(-60 * 24 * 55), actor: "buyer", title: "Подписан акт приёма-передачи", icon: "sign" },
      { id: "e3", at: iso(-60 * 24 * 50), actor: "admin", title: "Сделка завершена", icon: "check" },
    ],
  },
]

export function getDealById(id: string): Deal | undefined {
  return MOCK_DEALS.find((d) => d.id === id || d.shortId === id)
}

/** Mapping a buyer stage to its index and derived status helpers. */
export function stageStatusFor(current: BuyerStageKey, key: BuyerStageKey): StageStatus {
  const a = BUYER_STAGES.findIndex((s) => s.key === current)
  const b = BUYER_STAGES.findIndex((s) => s.key === key)
  if (b < a) return "done"
  if (b === a) return "current"
  return "pending"
}

export function sellerStageStatusFor(current: SellerStageKey, key: SellerStageKey): StageStatus {
  const a = SELLER_STAGES.findIndex((s) => s.key === current)
  const b = SELLER_STAGES.findIndex((s) => s.key === key)
  if (b < a) return "done"
  if (b === a) return "current"
  return "pending"
}

export function formatByn(v: number) {
  return new Intl.NumberFormat("ru-BY", {
    style: "currency",
    currency: "BYN",
    maximumFractionDigits: 0,
  }).format(v)
}

export function formatDateRu(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}
