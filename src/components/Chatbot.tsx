import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { MessageSquare, X, Send, Sparkles, CalendarClock, Tags, HelpCircle } from "lucide-react";
import scenarios from "@/data/botScenarios.json";
import services from "@/data/services.json";
import faq from "@/data/faq.json";
import { getFreeSlots } from "@/lib/schedule";
import { useBooking } from "@/context/BookingContext";
import { cn } from "@/lib/cn";

type Msg = {
  id: string;
  from: "bot" | "user";
  text?: string;
  component?: React.ReactNode;
};

const quickIcons: Record<string, React.ReactNode> = {
  pick: <Sparkles size={14} />,
  slots: <CalendarClock size={14} />,
  prices: <Tags size={14} />,
  ask: <HelpCircle size={14} />,
};

function uid() {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"idle" | "quiz" | "ask">("idle");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollToBooking } = useBooking();

  const fuse = useMemo(
    () =>
      new Fuse(faq, {
        keys: ["question", "answer", "keywords"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [],
  );

  useEffect(() => {
    if (messages.length === 0 && open) {
      pushBot(scenarios.greeting);
      setTimeout(() => {
        pushBot("", <QuickReplies onPick={handleQuickReply} />);
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function pushBot(text: string, component?: React.ReactNode) {
    setMessages((m) => [...m, { id: uid(), from: "bot", text, component }]);
  }
  function pushUser(text: string) {
    setMessages((m) => [...m, { id: uid(), from: "user", text }]);
  }

  function handleQuickReply(id: string) {
    const opt = scenarios.quickReplies.find((q) => q.id === id);
    if (opt) pushUser(opt.label);
    if (id === "pick") startQuiz();
    else if (id === "slots") showSlots();
    else if (id === "prices") showPrices();
    else if (id === "ask") {
      setMode("ask");
      pushBot("Напишите ваш вопрос. Я поищу в нашей базе знаний.");
    }
  }

  function startQuiz() {
    setMode("quiz");
    setQuizStep(0);
    setQuizAnswers({});
    pushBot(scenarios.quiz.intro);
    askQuizStep(0);
  }

  function askQuizStep(step: number) {
    const q = scenarios.quiz.questions[step];
    pushBot(
      q.prompt,
      <div className="mt-2 flex flex-wrap gap-2">
        {q.options.map((o) => (
          <button
            key={o.id}
            onClick={() => handleQuizAnswer(step, o)}
            className="rounded-full border border-ink/15 bg-sand-50 px-3 py-1.5 text-xs text-ink hover:border-copper hover:text-copper"
          >
            {o.label}
          </button>
        ))}
      </div>,
    );
  }

  function handleQuizAnswer(step: number, option: { id: string; label: string; weight: Record<string, string | number> }) {
    pushUser(option.label);
    const next = { ...quizAnswers, ...Object.fromEntries(Object.entries(option.weight).map(([k, v]) => [k, String(v)])) };
    setQuizAnswers(next);
    const nextStep = step + 1;
    if (nextStep < scenarios.quiz.questions.length) {
      setQuizStep(nextStep);
      setTimeout(() => askQuizStep(nextStep), 350);
    } else {
      setTimeout(() => finishQuiz(next), 400);
    }
  }

  function finishQuiz(answers: Record<string, string>) {
    const best = services
      .map((s) => {
        let score = 0;
        if (answers.effect && s.effect === answers.effect) score += 3;
        if (answers.category && s.category === answers.category) score += 2;
        if (answers.duration) {
          const wanted = Number(answers.duration);
          if (s.duration === wanted) score += 2;
          else if (Math.abs(s.duration - wanted) <= 30) score += 1;
        }
        return { s, score };
      })
      .sort((a, b) => b.score - a.score)[0].s;

    pushBot(
      `Рекомендую — ${best.name} (${best.duration} мин, ${best.price.toLocaleString("ru-RU")} ₽). ${best.shortDescription}`,
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          className="btn-primary !py-2 !px-4 !text-xs"
          onClick={() => {
            scrollToBooking({ serviceId: best.id });
            setOpen(false);
          }}
        >
          Записаться на эту программу
        </button>
        <button
          className="btn-outline !py-2 !px-4 !text-xs"
          onClick={() => {
            setMode("idle");
            pushBot("", <QuickReplies onPick={handleQuickReply} />);
          }}
        >
          Что-то другое
        </button>
      </div>,
    );
    setMode("idle");
  }

  function showSlots() {
    const slots = getFreeSlots(5);
    pushBot(
      "Ближайшие свободные слоты:",
      <div className="mt-2 space-y-2">
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={() => {
              pushUser(`${slot.label} · ${slot.time}`);
              scrollToBooking({ date: slot.date, time: slot.time });
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-xl border border-ink/10 bg-sand-50 px-3 py-2 text-left text-xs text-ink hover:border-copper"
          >
            <span>{slot.label}</span>
            <span className="font-display text-sm text-copper">{slot.time}</span>
          </button>
        ))}
        <button
          className="btn-ghost !text-xs"
          onClick={() => pushBot("", <QuickReplies onPick={handleQuickReply} />)}
        >
          ← Меню
        </button>
      </div>,
    );
  }

  function showPrices() {
    pushBot(
      "Актуальные программы:",
      <div className="mt-2 space-y-2">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-sand-50 px-3 py-2 text-xs text-ink"
          >
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink/50">
                {s.duration} мин · {s.category}
              </div>
            </div>
            <div className="font-display text-sm text-copper">
              {s.price.toLocaleString("ru-RU")} ₽
            </div>
          </div>
        ))}
        <button
          className="btn-ghost !text-xs"
          onClick={() => pushBot("", <QuickReplies onPick={handleQuickReply} />)}
        >
          ← Меню
        </button>
      </div>,
    );
  }

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    pushUser(text);
    setInput("");
    if (mode === "ask" || mode === "idle") {
      const hit = fuse.search(text)[0];
      setTimeout(() => {
        if (hit) {
          pushBot(hit.item.answer);
        } else {
          pushBot(scenarios.fallback);
        }
        setTimeout(() => {
          pushBot("", <QuickReplies onPick={handleQuickReply} />);
        }, 400);
      }, 350);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-ink px-5 py-4 text-sand-100 shadow-soft"
          >
            <MessageSquare size={18} />
            <span className="hidden md:inline">Ассистент</span>
            <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-copper text-[10px] text-sand-50">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[min(620px,calc(100vh-3rem))] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl bg-sand-100 shadow-soft"
          >
            <header className="flex items-center justify-between bg-ink p-5 text-sand-100">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-copper text-sand-50">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="font-display text-base">Цифровой ассистент</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sand-200/70">
                    обычно отвечает мгновенно
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-sand-200/80 hover:text-sand-50"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      m.from === "user"
                        ? "bg-ink text-sand-100"
                        : "bg-sand-50 text-ink",
                    )}
                  >
                    {m.text && <div>{m.text}</div>}
                    {m.component}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-ink/10 bg-sand-50 p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-sand-100 px-4 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите сообщение…"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="grid h-8 w-8 place-items-center rounded-full bg-copper text-sand-50 hover:bg-ink"
                  aria-label="Отправить"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function QuickReplies({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {scenarios.quickReplies.map((q) => (
        <button
          key={q.id}
          onClick={() => onPick(q.id)}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-sand-100 px-3 py-1.5 text-xs text-ink hover:border-copper hover:text-copper"
        >
          {quickIcons[q.id]} {q.label}
        </button>
      ))}
    </div>
  );
}
