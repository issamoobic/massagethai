export function Legal() {
  return (
    <section id="legal" className="relative overflow-hidden py-16 md:py-28">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="label-kicker">Правовая информация</span>
          <h2 className="mt-3 font-display text-[32px] leading-[1.1] text-ink sm:text-4xl md:text-5xl">
            Прозрачно и по правилам
          </h2>
          <p className="mt-4 text-ink/65">
            Эти документы нужны для спокойной записи и понятных условий обслуживания.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article id="policy" className="rounded-2xl border border-ink/10 bg-sand-100 p-5">
            <h3 className="font-display text-2xl text-ink">Политика ПД</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Мы берём только данные, нужные для записи: имя, телефон и комментарий.
              Передача третьим лицам не производится, кроме случаев, прямо требуемых законом.
            </p>
          </article>

          <article id="consent" className="rounded-2xl border border-ink/10 bg-sand-100 p-5">
            <h3 className="font-display text-2xl text-ink">Согласие клиента</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Отправляя форму, клиент подтверждает согласие на обработку персональных данных
              для связи по записи и уточнения деталей визита.
            </p>
          </article>

          <article id="contraindications" className="rounded-2xl border border-ink/10 bg-sand-100 p-5">
            <h3 className="font-display text-2xl text-ink">Противопоказания</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Перед сеансом важно сообщить о температуре, острых состояниях, беременности,
              травмах, аллергиях и других особенностях здоровья.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
