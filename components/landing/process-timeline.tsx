type Role = "buyer" | "seller"

const STEPS: { role: Role; text: string }[] = [
  { role: "buyer", text: "Зарегистрируйтесь на платформе и выберите авто" },
  { role: "buyer", text: "Ознакомьтесь с расчетами платежей. Если условия вам подходят, то нажмите \"Начать сделку\"" },
  { role: "buyer", text: "Авторизуйтесь через МСИ и предоставьте согласия" },
  { role: "seller", text: "Зарегистрируйтесь на платформе. Укажите данные по авто и подтвердите готовность к сделке" },
  { role: "buyer", text: "Подпишите договор лизинга и договор страхования КАСКО (если есть) через МСИ. Внесите аванс по сделке (если есть)" },
  { role: "seller", text: "Авторизуйтесь через МСИ и подпишите договор купли-продажи" },
  { role: "buyer", text: "Согласуйте встречу с продавцом. Осмотрите авто перед завершением сделки. Попросите продавца открыть QR-код в приложении сервиса. Отсканируйте QR-код продавца камерой в своем личном кабинете как подтверждение готовности получить авто" },
  { role: "seller", text: "На встрече — открыть QR в приложении для сканирования покупателем" },
  { role: "buyer", text: "Подпишите акт к договору лизинга через МСИ" },
  { role: "seller", text: "Подпишите акт к договору купли-продажи через МСИ" },
  { role: "buyer", text: "После получения уведомления от платформы вы можете забрать ключи у продавца" },
  { role: "seller", text: "Ожидайте зачисления средств на расчетный счет" },
  { role: "buyer", text: "После регистрации авто в ГАИ не забудьте загрузить техпаспорт в ваш личный кабинет" },
]

export function ProcessTimeline() {
  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {/* Mobile: общая вертикаль и точки по хронологии */}
      <div className="relative sm:hidden">
        <div
          className="absolute left-[11px] top-3 bottom-3 w-px bg-border"
          aria-hidden
        />
        <ol className="space-y-1">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-4 py-3">
              <div className="relative z-10 flex w-6 shrink-0 justify-center pt-1">
                <span
                  className="grid h-3 w-3 place-items-center rounded-full border-2 border-primary bg-background ring-2 ring-background"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {step.role === "buyer" ? "Покупатель" : "Продавец"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Desktop: вертикальная ось по центру, покупатель слева, продавец справа */}
      <div className="mx-auto hidden max-w-3xl sm:block">
        <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <p className="text-right">Покупатель</p>
          <span aria-hidden />
          <p>Продавец</p>
        </div>

        <div className="relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border"
            aria-hidden
          />

          <ol className="relative space-y-1">
            {STEPS.map((step, i) => {
              const isBuyer = step.role === "buyer"
              return (
                <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-1">
                  <div className="min-h-[3rem] px-6 text-right text-pretty text-sm leading-snug text-foreground">
                    {isBuyer ? step.text : <span className="text-muted-foreground/40">—</span>}
                  </div>

                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
                    <span
                      className="grid h-3 w-3 place-items-center rounded-full border-2 border-primary bg-background shadow-sm ring-4 ring-background"
                      aria-label={`Шаг ${i + 1}`}
                    />
                  </div>

                  <div className="min-h-[3rem] px-6 text-pretty text-sm leading-snug text-foreground">
                    {!isBuyer ? step.text : <span className="text-muted-foreground/40">—</span>}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
