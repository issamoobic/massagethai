import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import faqs from "@/data/faq.json";

export function FAQ() {
  const [open, setOpen] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" className="relative py-16 md:py-36">
      <div className="container-x grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          <span className="label-kicker">Вопросы и ответы</span>
          <h2 className="mt-3 font-display text-[32px] leading-[1.1] text-ink sm:text-4xl md:text-5xl md:leading-tight">
            Коротко о <span className="italic text-copper">главном</span>
          </h2>
          <p className="mt-5 text-ink/65 md:mt-6">
            Если вашего вопроса нет — спросите в чате ассистента справа внизу или по
            телефону.
          </p>
        </div>

        <div className="md:col-span-8">
          <div className="space-y-3">
            {faqs.map((f) => {
              const active = open === f.id;
              return (
                <div
                  key={f.id}
                  className="rounded-2xl border border-ink/10 bg-sand-100 transition hover:border-copper/40"
                >
                  <button
                    onClick={() => setOpen(active ? null : f.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="font-display text-base text-ink sm:text-lg md:text-xl">
                      {f.question}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink">
                      {active ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-ink/70 sm:px-6 sm:pb-6">{f.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
