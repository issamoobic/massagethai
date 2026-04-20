export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand-200">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl text-ink">
              Мастерская тайских массажных практик
            </div>
            <p className="mt-3 max-w-sm text-sm text-ink/60">
              Авторская студия одного мастера. Новосибирск, 2026. Все материалы сайта —
              не являются публичной офертой.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="label-kicker">Навигация</div>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              {[
                ["#about", "О мастере"],
                ["#services", "Программы"],
                ["#booking", "Онлайн-запись"],
                ["#reviews", "Отзывы"],
                ["#faq", "FAQ"],
                ["#contacts", "Контакты"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:text-copper">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="label-kicker">Правовое</div>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li>
                <a href="#" className="hover:text-copper">
                  Политика обработки ПД
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-copper">
                  Согласие на рассылку
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-copper">
                  Противопоказания
                </a>
              </li>
              <li>Работа по предварительной записи · ИП [реквизиты заказчика]</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink/50 md:flex-row md:items-center">
          <div>© 2026 Мнимения. Все права защищены.</div>
          <div className="flex gap-4">
            <a href="https://vk.com/mnimenya_massage" target="_blank" rel="noreferrer" className="hover:text-copper">
              VK
            </a>
            <a href="#" className="hover:text-copper">
              Telegram
            </a>
            <a href="#" className="hover:text-copper">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
