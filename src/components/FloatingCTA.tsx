import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const { scrollToBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          onClick={() => scrollToBooking()}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sand-100 shadow-soft md:hidden"
        >
          <CalendarClock size={16} />
          Записаться
        </motion.button>
      )}
    </AnimatePresence>
  );
}
