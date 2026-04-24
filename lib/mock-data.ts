// Domain types for Авторассрочка.
// NOTE: These shapes mirror a future Supabase schema (users, deals, cars, documents, stage_events)
// so the app can be rewired from in-memory mocks to real tables with minimal changes.

export type Role = "buyer" | "seller" | "admin"

export type StageStatus = "pending" | "current" | "done" | "blocked"

/** 12 этапов в кабинете покупателя (порядок совпадает с UI таймлайна). */
export const BUYER_STAGES = [
  { key: "application", title: "Регистрация и авто", short: "Старт" },
  { key: "msi_buyer", title: "МСИ и согласия", short: "МСИ" },
  { key: "pdn", title: "Расчёт и согласие", short: "Расчёт" },
  { key: "car_check", title: "Проверка автомобиля", short: "Авто" },
  { key: "application_form", title: "Условия лизинга", short: "Условия" },
  { key: "seller_response", title: "Связь с продавцом", short: "Продавец" },
  { key: "approval", title: "ДФЛ и КАСКО", short: "Договоры" },
  { key: "sign_dfl", title: "Подпись ДФЛ и КАСКО", short: "Подпись" },
  { key: "advance", title: "Аванс по сделке", short: "Аванс" },
  { key: "inspection", title: "Встреча и осмотр", short: "Осмотр" },
  { key: "sign_act", title: "Акт к ДФЛ", short: "Акт" },
  { key: "complete", title: "Ключи и регистрация", short: "Готово" },
] as const

export type BuyerStageKey = (typeof BUYER_STAGES)[number]["key"]

/** 10 этапов в кабинете продавца. */
export const SELLER_STAGES = [
  { key: "incoming", title: "Запрос платформы", short: "Запрос" },
  { key: "msi_seller", title: "МСИ продавца", short: "МСИ" },
  { key: "seller_checks", title: "Проверки", short: "Проверки" },
  { key: "confirm_terms", title: "Подтверждение и данные", short: "Данные" },
  { key: "sign_dkp", title: "ДКП на авто", short: "ДКП" },
  { key: "qr_inspection", title: "QR для покупателя", short: "QR" },
  { key: "inspection_done", title: "Осмотр", short: "Осмотр" },
  { key: "sign_act", title: "Акт к ДКП", short: "Акт" },
  { key: "payout", title: "Выплата за авто", short: "Деньги" },
  { key: "complete", title: "Сделка закрыта", short: "Готово" },
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
