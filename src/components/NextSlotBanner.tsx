import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import {
  getNextUpcomingSlot,
  formatCountdown,
  type UpcomingSlot,
} from "@/lib/schedule";
import { useBooking } from "@/context/BookingContext";

export function NextSlotBanner() {
  const { scrollToBooking } = useBooking();
  const [slot, setSlot] = useState<UpcomingSlot | null>(() => getNextUpcomingSlot());
  const [countdown, setCountdown] = useState<string>(() =>
    slot ? formatCountdown(slot.datetime) : "",
  );
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const tick = () => {
      const next = getNextUpcomingSlot();
      setSlot(next);
      if (next) setCountdown(formatCountdown(next.datetime));
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    };
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!slot) return null;

  const whenLabel = slot.isToday
    ? `Сегодня в ${slot.time}`
    : slot.isTomorrow
      ? `Завтра в ${slot.time}`
      : `${slot.label}, ${slot.time}`;

  return (
    <motion.button
      onClick={() => scrollToBooking({ date: slot.date, time: slot.time })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      whileHover={{ y: -3 }}
      className="group flex w-full max-w-full items-center gap-3 rounded-3xl border border-copper/40 bg-sand-50/80 py-2.5 pl-2.5 pr-4 text-left shadow-soft backdrop-blur-sm hover:border-copper sm:inline-flex sm:w-auto sm:gap-4 sm:rounded-full sm:py-3 sm:pl-3 sm:pr-5"
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-copper/15 text-copper sm:h-10 sm:w-10">
        <Clock size={16} strokeWidth={2} />
        <span
          className={`absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full bg-coral ${
            pulse ? "animate-ping" : ""
          }`}
        />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-coral" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[10px] uppercase tracking-[0.22em] text-ink/50">
          Ближайший свободный сеанс
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-ink">
          <span className="font-display text-base sm:text-lg">{whenLabel}</span>
          <span className="text-xs text-copper">· {countdown}</span>
        </span>
      </span>
      <ArrowRight
        size={18}
        className="ml-1 shrink-0 text-ink/50 transition-transform group-hover:translate-x-1 group-hover:text-copper sm:ml-2"
      />
    </motion.button>
  );
}
