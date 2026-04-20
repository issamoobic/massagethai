import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import reviews from "@/data/reviews.json";

export function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];

  const prev = () => setI((v) => (v - 1 + reviews.length) % reviews.length);
  const next = () => setI((v) => (v + 1) % reviews.length);

  return (
    <section id="reviews" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-kicker">Отзывы</span>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-6xl">
              Что говорят <span className="italic text-copper">гости</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Star className="fill-copper text-copper" size={16} />
            4.97 из 5 · Яндекс, 2ГИС, Google
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Quote className="absolute -top-6 -left-2 text-copper/30" size={72} />
                  <p className="font-display text-2xl leading-relaxed text-ink md:text-3xl md:leading-[1.3]">
                    «{r.text}»
                  </p>
                  <footer className="mt-8 flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg text-copper">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display text-lg text-ink">{r.author}</div>
                      <div className="text-xs uppercase tracking-widest text-ink/50">
                        {r.source} · {new Date(r.date).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={prev}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink hover:border-copper hover:text-copper"
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink hover:border-copper hover:text-copper"
                aria-label="Следующий отзыв"
              >
                <ChevronRight size={20} />
              </button>
              <div className="ml-auto text-sm text-ink/50">
                {String(i + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {reviews.map((rev, idx) => (
                <button
                  key={rev.id}
                  onClick={() => setI(idx)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    idx === i
                      ? "border-copper bg-copper/5"
                      : "border-ink/10 hover:border-copper/50"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, j) => (
                      <Star key={j} size={12} className="fill-copper text-copper" />
                    ))}
                  </div>
                  <div className="mt-3 font-display text-sm text-ink">{rev.author}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-ink/60">{rev.text}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
