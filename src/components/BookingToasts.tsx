import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import services from "@/data/services.json";

type ToastData = {
  id: string;
  name: string;
  service: string;
  timeAgo: string;
};

const NAMES = [
  "Анна",
  "Мария",
  "Екатерина",
  "Ольга",
  "Ксения",
  "Ирина",
  "Светлана",
  "Наталья",
  "Юлия",
  "Алина",
  "Дарья",
  "Елена",
  "Татьяна",
  "Анастасия",
  "Полина",
  "Алёна",
  "Валерия",
  "Елизавета",
  "Марина",
  "Евгения",
  "София",
  "Виктория",
  "Александр",
  "Дмитрий",
  "Михаил",
  "Андрей",
  "Артём",
  "Илья",
  "Павел",
  "Максим",
  "Сергей",
  "Владимир",
];

const TIMES_AGO = [
  "только что",
  "2 минуты назад",
  "4 минуты назад",
  "7 минут назад",
  "12 минут назад",
  "18 минут назад",
  "24 минуты назад",
];

const FIRST_DELAY = [18_000, 26_000];
const NEXT_INTERVAL = [55_000, 95_000];
const VISIBLE_MS = 6500;
const MAX_PER_SESSION = 5;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function between([a, b]: readonly [number, number]): number {
  return Math.floor(a + Math.random() * (b - a));
}
function uid(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function buildToast(): ToastData {
  const service = pick(services);
  const name = pick(NAMES);
  const isMale = ["Александр", "Дмитрий", "Михаил", "Андрей", "Артём", "Илья", "Павел", "Максим", "Сергей", "Владимир"].includes(name);
  const timeAgo = pick(TIMES_AGO);
  return {
    id: uid(),
    name,
    service: isMale
      ? `записался на «${service.name}»`
      : `записалась на «${service.name}»`,
    timeAgo,
  };
}

export function BookingToasts() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const shownCountRef = useRef(0);
  const firstTimerRef = useRef<number | undefined>();
  const nextTimerRef = useRef<number | undefined>();
  const hideTimerRef = useRef<number | undefined>();

  useEffect(() => {
    if (dismissed) return;

    function showToast() {
      if (shownCountRef.current >= MAX_PER_SESSION) return;
      shownCountRef.current += 1;
      setToast(buildToast());
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setToast(null);
        window.clearTimeout(nextTimerRef.current);
        nextTimerRef.current = window.setTimeout(showToast, between(NEXT_INTERVAL as [number, number]));
      }, VISIBLE_MS);
    }

    firstTimerRef.current = window.setTimeout(showToast, between(FIRST_DELAY as [number, number]));

    return () => {
      window.clearTimeout(firstTimerRef.current);
      window.clearTimeout(nextTimerRef.current);
      window.clearTimeout(hideTimerRef.current);
    };
  }, [dismissed]);

  function handleDismiss() {
    setToast(null);
    setDismissed(true);
  }

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-40 md:bottom-6 md:left-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-[min(340px,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-ink/10 bg-sand-100/95 p-3 shadow-soft backdrop-blur-sm"
          >
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-copper/15 text-copper">
              <Sparkles size={16} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-sand-100" />
            </div>
            <div className="flex-1 text-[13px] leading-tight text-ink">
              <div>
                <span className="font-medium">{toast.name}</span>{" "}
                <span className="text-ink/75">{toast.service}</span>
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                {toast.timeAgo}
              </div>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Скрыть"
              className="shrink-0 text-ink/40 transition hover:text-ink"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
