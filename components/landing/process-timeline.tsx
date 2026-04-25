type Role = "buyer" | "seller" | "platform"

type Step = {
  role: Role
  text: string
  sellerText?: string
}

const STEPS: Step[] = [
  {
    role: "buyer",
    text: "Выберите интересующий Вас авто на рынке Беларуси, договоритесь с продавцом авто о покупке в лизинг через платформу «Авторассрочка»",
  },
  { role: "buyer", text: "Зарегистрируйтесь на платформе и укажите данные авто" },
  {
    role: "buyer",
    text: "Получите расчет платежей от платформы и ознакомьтесь с ним. Если условия вам подходят, то начните новую сделку по кнопке «Начать сделку» либо выберите другой авто для расчета",
  },
  {
    role: "buyer",
    text: "Пройдите Online-идентификацию на платформе через МСИ (межбанковская система идентификации) и предоставьте согласия на проверку вашей кредитной истории, а также получение данных в ФСЗН",
  },
  {
    role: "buyer",
    text: "Заполните недостающие данные по сделке и контакты продавца для дальнейшей связи с ним",
  },
  {
    role: "platform",
    text: "После проверки данных покупателя и автомобиля платформа отправит СМС продавцу со ссылкой на сделку",
  },
  {
    role: "seller",
    text: "Зарегистрируйтесь и пройдите Online-идентификацию на платформе, дополните данные по вашему авто (сделайте фото авто + фото документов как указано в инструкции) и подтвердите готовность к сделке",
  },
  {
    role: "platform",
    text: "После подтверждения условий сделки продавцом платформа уведомит покупателя о дальнейших шагах",
  },
  {
    role: "buyer",
    text: "Подпишите договор лизинга и договор страхования КАСКО (если предусмотрен) на платформе через МСИ. Внесите аванс по сделке (если предусмотрен)",
  },
  { role: "seller", text: "Подпишите договор купли-продажи на платформе через МСИ" },
  {
    role: "platform",
    text: "После подписания документов платформа уведомит покупателя и продавца о необходимости передать авто",
  },
  {
    role: "buyer",
    text: "Согласуйте встречу с продавцом. Осмотрите авто перед завершением сделки. Сделайте фото авто в приложении платформы как указано в инструкции",
  },
  {
    role: "buyer",
    text: "Если вы готовы забрать авто, то попросите продавца открыть QR-код в приложении платформы. Отсканируйте QR-код продавца камерой в своем личном кабинете как подтверждение готовности получить авто",
  },
  {
    role: "seller",
    text: "Если вы готовы передать авто на встрече с покупателем, то откройте QR в личном кабинете платформы и предоставьте для его сканирования",
  },
  { role: "buyer", text: "Подпишите акт к договору лизинга на платформе через МСИ" },
  { role: "seller", text: "Подпишите акт к договору купли-продажи на платформе через МСИ" },
  {
    role: "platform",
    text: "После подписания актов сторонами платформа уведомит покупателя и продавца об успешном заключении сделки",
  },
  {
    role: "buyer",
    text: "После получения уведомления от платформы вы можете забрать ключи у продавца",
    sellerText: "После получения уведомления от платформы вы можете передать ключи покупателю",
  },
  {
    role: "seller",
    text: "Ожидайте зачисления средств на расчетный счет сегодня либо на следующий банковский день",
  },
  {
    role: "buyer",
    text: "После регистрации авто в ГАИ не забудьте загрузить техпаспорт в ваш личный кабинет на платформе",
  },
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
                  {step.role === "buyer"
                    ? "Покупатель"
                    : step.role === "seller"
                      ? "Продавец"
                      : "Платформа"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                {step.sellerText && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.sellerText}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Desktop: вертикальная ось по центру, покупатель слева, продавец справа, платформа по центру */}
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
              const isSeller = step.role === "seller"
              const isPlatform = step.role === "platform"

              if (isPlatform) {
                return (
                  <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-2">
                    <div />
                    <div className="relative z-10 w-[26rem] max-w-[80vw] -translate-x-1/2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Платформа</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">{step.text}</p>
                    </div>
                    <div />
                  </li>
                )
              }

              if (step.sellerText) {
                return (
                  <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-1">
                    <div className="min-h-[3rem] px-6 text-right text-pretty text-sm leading-snug text-foreground">
                      <p>{step.text}</p>
                    </div>
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
                      <span
                        className="grid h-3 w-3 place-items-center rounded-full border-2 border-primary bg-background shadow-sm ring-4 ring-background"
                        aria-label="Действие"
                      />
                    </div>
                    <div className="min-h-[3rem] px-6 text-pretty text-sm leading-snug text-foreground">
                      <p>{step.sellerText}</p>
                    </div>
                  </li>
                )
              }

              return (
                <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-1">
                  <div className="min-h-[3rem] px-6 text-right text-pretty text-sm leading-snug text-foreground">
                    {isBuyer ? (
                      <>
                        <p>{step.text}</p>
                      </>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
                    <span
                      className="grid h-3 w-3 place-items-center rounded-full border-2 border-primary bg-background shadow-sm ring-4 ring-background"
                      aria-label="Действие"
                    />
                  </div>

                  <div className="min-h-[3rem] px-6 text-pretty text-sm leading-snug text-foreground">
                    {isSeller ? (
                      <>
                        <p>{step.text}</p>
                      </>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
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
