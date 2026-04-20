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
      className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-44 md:pb-40"
    >
      <DecorPatterns />

      <div className="container-x relative z-10 grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-8"
        >
          <span className="label-kicker mb-4 inline-flex items-center gap-2 md:mb-6">
            <Sparkles size={12} /> Мастерская Мнимения · Новосибирск
          </span>

          <h1 className="font-display text-[30px] leading-[1.1] text-ink sm:text-[52px] sm:leading-[1.02] md:text-[60px] md:leading-[0.98] lg:text-[84px] lg:leading-[0.95] xl:text-[104px] xl:leading-[0.92]">
            Тайские{" "}
            <span className="italic text-copper-600">восстановительные</span>{" "}
            практики <span className="italic">Анфисы</span>.
          </h1>

          <p className="mt-6 max-w-xl text-base text-ink/70 sm:text-lg md:mt-8 md:text-xl">
            Авторская мастерская одного мастера. Тайский массаж, балийский ойл-ритуал,
            травяные мешочки — в тишине, без конвейера, 90+ минут времени только для вас.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-10 md:gap-4">
            <button onClick={() => scrollToBooking()} className="btn-primary w-full text-base sm:w-auto">
              Записаться на сеанс
              <ArrowDownRight size={18} />
            </button>
            <a href="#services" className="btn-outline w-full text-base sm:w-auto">
              Программы и цены
            </a>
          </div>

          <div className="mt-6 md:mt-8">
            <NextSlotBanner />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:col-span-4 md:block"
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
        className="container-x relative z-10 mt-12 md:mt-28"
      >
        <div className="hairline" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-baseline gap-3 md:gap-4">
              <div className="font-display text-4xl text-ink sm:text-5xl md:text-6xl">{m.value}</div>
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
      {/* мягкое лавандовое сияние сзади */}
      <motion.div
        animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-[44%_56%_42%_58%/48%_38%_62%_52%] bg-coral/40 blur-2xl"
      />
      {/* золотая аура */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-10 rounded-full bg-copper/15 blur-3xl"
      />

      {/* декоративные золотые круги */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 rounded-full border border-copper/25"
      />
      <div className="absolute inset-14 rounded-full border border-copper/15" />

      {/* логотип бренда без подложки */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src="/logo.png"
          alt="Мастерская Мнимения"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="h-72 w-72 drop-shadow-[0_15px_45px_rgba(59,27,78,0.45)]"
          draggable={false}
        />
      </div>

      <div className="absolute -right-4 top-10 animate-float rounded-full bg-sand-50 px-4 py-2 text-xs uppercase tracking-widest text-ink shadow-soft">
        Nuad Boran
      </div>
      <div className="absolute -left-4 bottom-16 animate-float rounded-full bg-copper px-4 py-2 text-xs uppercase tracking-widest text-ink shadow-glow">
        Luk Pra Kob
      </div>
    </div>
  );
}

function DecorPatterns() {
  return (
    <>
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-coral/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 h-[520px] w-[520px] rounded-full bg-copper/15 blur-3xl" />
      {/* золотая линия-декор */}
      <svg
        className="pointer-events-none absolute right-6 top-24 hidden h-40 w-40 text-copper/50 md:block"
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
