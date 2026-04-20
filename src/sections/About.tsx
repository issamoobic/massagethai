import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import master from "@/data/master.json";

export function About() {
  return (
    <section id="about" className="relative py-16 md:py-40">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5"
          >
            <Portrait />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            <span className="label-kicker">О мастере</span>
            <h2 className="mt-4 font-display text-[30px] leading-[1.1] text-ink sm:text-4xl md:text-6xl md:leading-tight">
              {master.name}.<br />
              <span className="italic text-ink/60">{master.title}.</span>
            </h2>

            <div className="mt-8 rounded-3xl bg-ink p-6 text-sand-100 sm:p-8 md:mt-10 md:p-10">
              <Quote className="text-copper" size={28} />
              <p className="mt-4 font-display text-xl italic leading-relaxed sm:text-2xl md:text-3xl">
                «{master.quote}»
              </p>
            </div>

            <p className="mt-8 text-base leading-relaxed text-ink/75 sm:text-lg md:mt-10">{master.bio}</p>

            <div className="mt-8 grid gap-4 sm:gap-6 md:mt-10 md:grid-cols-3">
              {master.philosophy.map((p) => (
                <div key={p.title} className="rounded-2xl border border-ink/10 bg-sand-100 p-5">
                  <div className="font-display text-xl text-ink">{p.title}</div>
                  <div className="mt-2 text-sm text-ink/65">{p.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-8 sm:gap-10 md:mt-12 md:grid-cols-2">
              <div>
                <span className="label-kicker">Техники</span>
                <ul className="mt-4 space-y-2">
                  {master.techniques.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-ink/80">
                      <span className="mt-2 h-1 w-6 bg-copper" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="label-kicker">Образование и сертификаты</span>
                <ul className="mt-4 space-y-2">
                  {master.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-ink/80">
                      <span className="mt-2 h-1 w-6 bg-coral" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Portrait() {
  return (
    <div className="md:sticky md:top-28">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-700 to-ink/80" />
        {/* силуэт-иллюстрация вместо фото (реальное фото заменит клиент) */}
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full text-copper/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="200" cy="170" r="70" stroke="currentColor" strokeWidth="1.2" />
          <path d="M110 420 C 110 300, 290 300, 290 420 Z" />
          <circle cx="200" cy="170" r="48" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <path d="M60 470 L 340 470" />
          <path d="M80 490 L 320 490" opacity="0.6" />
        </svg>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sand-100">
          <div>
            <div className="label-kicker !text-sand-400">портрет</div>
            <div className="font-display text-xl">Анфиса Яргина</div>
          </div>
          <div className="font-display text-4xl text-copper">8+</div>
        </div>
      </div>
    </div>
  );
}
