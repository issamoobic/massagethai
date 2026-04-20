import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type BookingIntent = {
  serviceId?: string;
  date?: string;
  time?: string;
};

type Ctx = {
  intent: BookingIntent;
  setIntent: (v: BookingIntent) => void;
  scrollToBooking: (v?: BookingIntent) => void;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<BookingIntent>({});

  const scrollToBooking = useCallback((v?: BookingIntent) => {
    if (v) setIntent(v);
    queueMicrotask(() => {
      const el = document.getElementById("booking");
      if (!el) return;
      const navH = window.innerWidth < 768 ? 64 : 80;
      const y = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });
  }, []);

  const value = useMemo(() => ({ intent, setIntent, scrollToBooking }), [intent, scrollToBooking]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be inside BookingProvider");
  return ctx;
}
