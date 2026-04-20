import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const nav = [
  { href: "#about", label: "О мастере" },
  { href: "#services", label: "Программы" },
  { href: "#booking", label: "Запись" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-sand-100/90 backdrop-blur-md shadow-soft" : "bg-transparent",
      )}
    >
      <div className="container-x flex items-center justify-between py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2"
        >
          <LogoMark />
          <div className="leading-tight">
            <div className="font-display text-lg text-ink">Мнимения</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/60">
              Thai · Bali · Ritual
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(n.href);
              }}
              className="relative text-sm text-ink/75 transition hover:text-copper"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              handleClick("#booking");
            }}
            className="btn-primary"
          >
            Записаться
          </a>
        </div>

        <button
          className="md:hidden"
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <>
                <path d="M6 6l16 16M22 6L6 22" />
              </>
            ) : (
              <>
                <path d="M4 9h20M4 19h20" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-sand-50 border-t border-ink/10"
        >
          <div className="container-x flex flex-col gap-4 py-6">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(n.href);
                }}
                className="text-ink/80"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                handleClick("#booking");
              }}
              className="btn-primary self-start"
            >
              Записаться
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="text-copper">
      <circle cx="18" cy="18" r="17" fill="#1E3A4C" />
      <path
        d="M9 23c0-6 4-11 9-11s9 5 9 11"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="18" cy="12" r="2.4" fill="#D4806A" />
    </svg>
  );
}
