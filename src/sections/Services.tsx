import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Coins, X, ArrowUpRight, Leaf } from "lucide-react";
import services from "@/data/services.json";
import { cn } from "@/lib/cn";
import { useBooking } from "@/context/BookingContext";

type Service = (typeof services)[number];

const categories = ["Все", "Традиционный", "Масляный", "С прогреванием", "Локальный", "Для двоих"];

export function Services() {
  const [active, setActive] = useState("Все");
  const [selected, setSelected] = useState<Service | null>(null);

  const filtered = useMemo(
    () => (active === "Все" ? services : services.filter((s) => s.category === active)),
    [active],
  );

  return (
    <section id="services" className="section-ink relative overflow-hidden py-16 md:py-36">
      <DecorLotus />

      <div className="container-x relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <span className="label-kicker">Программы</span>
            <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-[1.1] text-sand-100 sm:text-4xl md:text-6xl md:leading-tight">
              Шесть программ. <span className="italic text-copper">Одна философия.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-sand-200/80 sm:text-base">
            Длительность от 60 до 120 минут. Короче не делаем — телу нужно время, чтобы
            действительно расслабиться.
          </p>
        </div>

        <div className="no-scrollbar -mx-6 mt-8 flex gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:mt-10 md:px-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm whitespace-nowrap transition",
                active === c
                  ? "border-copper bg-copper text-sand-50"
                  : "border-sand-100/25 text-sand-100/80 hover:border-copper hover:text-copper",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid gap-4 sm:gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <motion.button
                key={s.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                onClick={() => setSelected(s)}
                className="group relative overflow-hidden rounded-3xl border border-sand-100/10 bg-ink-700/40 p-6 text-left transition hover:border-copper hover:bg-ink-700/60"
              >
                <div className="flex items-start justify-between">
                  <span className="chip !border-sand-100/20 !text-sand-100/70">
                    {s.category}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-sand-100/40 transition group-hover:text-copper"
                  />
                </div>

                <div className="mt-10">
                  <div className="label-kicker !text-coral">{s.subtitle}</div>
                  <h3 className="mt-2 font-display text-3xl text-sand-100">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand-200/70">
                    {s.shortDescription}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-sand-200/70">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {s.duration} мин
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Leaf size={14} /> {s.effect}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 font-display text-2xl text-copper">
                    <Coins size={16} />
                    {s.price.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ServiceModal service={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const { scrollToBooking } = useBooking();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/70 p-4 py-10 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-sand-100 shadow-soft"
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-10 rounded-full bg-sand-50 p-2 text-ink hover:bg-copper hover:text-sand-50"
        >
          <X size={18} />
        </button>
        <div className="bg-ink p-6 pr-14 text-sand-100 sm:p-8 md:p-10">
          <div className="label-kicker !text-coral">{service.subtitle}</div>
          <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
            {service.name}
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sand-200/80">
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {service.duration} минут
            </span>
            <span>{service.effect}</span>
            <span className="font-display text-2xl text-copper">
              {service.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <p className="text-ink/80">{service.description}</p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <span className="label-kicker">Подходит, если</span>
              <ul className="mt-3 space-y-2">
                {service.goodFor.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-ink/75">
                    <span className="mt-2 h-1 w-4 bg-copper" /> {g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="label-kicker">Противопоказания</span>
              <ul className="mt-3 space-y-2">
                {service.contraindications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-ink/75">
                    <span className="mt-2 h-1 w-4 bg-coral" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                scrollToBooking({ serviceId: service.id });
                onClose();
              }}
              className="btn-primary"
            >
              Записаться на эту программу
            </button>
            <button onClick={onClose} className="btn-outline">
              Посмотреть другие
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DecorLotus() {
  return (
    <>
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[1200px] -translate-x-1/2 rounded-full bg-copper/10 blur-3xl" />
      <svg
        className="pointer-events-none absolute right-0 top-10 hidden h-64 w-64 text-copper/15 md:block"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <g transform="translate(100,100)">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-50"
              rx="18"
              ry="55"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r="20" fill="#B87333" />
        </g>
      </svg>
    </>
  );
}
