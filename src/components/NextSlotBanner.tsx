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
      className="group inline-flex items-center gap-4 rounded-full border border-copper/40 bg-sand-50/80 py-3 pl-3 pr-5 text-left shadow-soft backdrop-blur-sm hover:border-copper"
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-copper/15 text-copper">
        <Clock size={16} strokeWidth={2} />
        <span
          className={`absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full bg-coral ${
            pulse ? "animate-ping" : ""
          }`}
        />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-coral" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.22em] text-ink/50">
          Ближайший свободный сеанс
        </span>
        <span className="flex items-baseline gap-2 text-ink">
          <span className="font-display text-lg">{whenLabel}</span>
          <span className="text-xs text-copper">· {countdown}</span>
        </span>
      </span>
      <ArrowRight
        size={18}
        className="ml-2 text-ink/50 transition-transform group-hover:translate-x-1 group-hover:text-copper"
      />
    </motion.button>
  );
}
