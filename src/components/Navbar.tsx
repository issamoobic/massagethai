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

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

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
        scrolled ? "bg-sand-50/92 backdrop-blur-md shadow-soft" : "bg-transparent",
      )}
    >
      <div className="container-x flex items-center justify-between gap-3 py-3 md:py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex min-w-0 items-center gap-2 md:gap-3"
        >
          <img
            src="/logo.png"
            alt="Мастерская Мнимения"
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 select-none md:h-12 md:w-12"
            draggable={false}
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-base text-ink md:text-lg">
              Мастерская <span className="italic text-copper-600">Мнимения</span>
            </div>
            <div className="hidden truncate text-[10px] uppercase tracking-[0.3em] text-ink/60 sm:block">
              Анфиса Яргина · Thai Bodywork
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
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l16 16M22 6L6 22" />
            ) : (
              <path d="M4 9h20M4 19h20" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="safe-bottom max-h-[calc(100vh-56px)] overflow-y-auto border-t border-ink/10 bg-sand-50 md:hidden"
        >
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(n.href);
                }}
                className="rounded-2xl px-3 py-3 text-base text-ink/80 hover:bg-sand-100 active:bg-sand-200"
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
              className="btn-primary mt-3 w-full"
            >
              Записаться
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

