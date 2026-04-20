import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { NextSlotBanner } from "@/components/NextSlotBanner";

const metrics = [
  { value: "8+", label: "лет практики" },
  { value: "3 000+", label: "гостей" },
  { value: "1 : 1", label: "один мастер — один гость" },
];

export function Hero() {
  const { scrollToBooking } = useBooking();
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-40"
    >
      <DecorPatterns />

      <div className="container-x relative z-10 grid gap-12 md:grid-cols-12 md:items-end">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-8"
        >
          <span className="label-kicker mb-6 inline-flex items-center gap-2">
            <Sparkles size={12} /> Мастерская · Новосибирск
          </span>

          <h1 className="font-display text-5xl leading-[0.95] text-ink md:text-[104px] md:leading-[0.92]">
            Тайские массажные <br />
            <span className="italic text-copper">практики</span>,<br />
            возвращение <span className="italic">к&nbsp;себе</span>.
          </h1>

          <p className="mt-8 max-w-xl text-lg text-ink/70 md:text-xl">
            Авторская студия одного мастера. Нет конвейера, нет соседних кабинетов —
            только тишина, аутентичные техники и 90+ минут времени только для вас.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button onClick={() => scrollToBooking()} className="btn-primary text-base">
              Записаться на сеанс
              <ArrowDownRight size={18} />
            </button>
            <a href="#services" className="btn-outline text-base">
              Программы и цены
            </a>
          </div>

          <div className="mt-8">
            <NextSlotBanner />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-4"
        >
          <div className="relative">
            <HeroVisual />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="container-x relative z-10 mt-16 md:mt-28"
      >
        <div className="hairline" />
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-baseline gap-4">
              <div className="font-display text-5xl text-ink md:text-6xl">{m.value}</div>
              <div className="text-sm text-ink/60">{m.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
      {/* фоновый коралловый blob */}
      <motion.div
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[40%_60%_42%_58%/48%_38%_62%_52%] bg-coral/80 blur-[1px]"
      />
      <motion.div
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-6 rounded-[58%_42%_60%_40%/40%_60%_40%_60%] bg-ink"
      />
      {/* медное кольцо */}
      <div className="absolute inset-10 rounded-full border border-copper/60" />
      <div className="absolute inset-14 rounded-full border border-copper/30" />
      {/* лого-иероглиф стилизованный */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 140 140" className="text-sand-100">
          <circle cx="70" cy="70" r="4" fill="currentColor" />
          <path
            d="M70 20 L70 60 M70 80 L70 120 M20 70 L60 70 M80 70 L120 70"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M70 50 Q45 70 70 90 Q95 70 70 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>
      <div className="absolute -right-4 top-10 animate-float rounded-full bg-sand-100 px-4 py-2 text-xs uppercase tracking-widest text-ink shadow-soft">
        Nuad Boran
      </div>
      <div className="absolute -left-4 bottom-16 animate-float rounded-full bg-copper px-4 py-2 text-xs uppercase tracking-widest text-sand-50 shadow-glow">
        Luk Pra Kob
      </div>
    </div>
  );
}

function DecorPatterns() {
  return (
    <>
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 h-[520px] w-[520px] rounded-full bg-copper/10 blur-3xl" />
      {/* медная линия-декор */}
      <svg
        className="pointer-events-none absolute right-6 top-24 hidden h-40 w-40 text-copper/40 md:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="24" />
        <path d="M50 2 L50 98 M2 50 L98 50" />
      </svg>
    </>
  );
}
