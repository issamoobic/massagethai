import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [inBooking, setInBooking] = useState(false);
  const { scrollToBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
      const booking = document.getElementById("booking");
      if (booking) {
        const rect = booking.getBoundingClientRect();
        setInBooking(rect.top < window.innerHeight * 0.6 && rect.bottom > 120);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !inBooking && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => scrollToBooking()}
          className="fixed left-5 z-40 flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-3 text-sand-100 shadow-soft md:hidden"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <CalendarClock size={16} />
          Записаться
        </motion.button>
      )}
    </AnimatePresence>
  );
}
