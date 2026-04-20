import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import services from "@/data/services.json";
import { generateSchedule } from "@/lib/schedule";
import { saveBooking } from "@/lib/storage";
import { useBooking } from "@/context/BookingContext";
import { cn } from "@/lib/cn";

const contactsSchema = z.object({
  name: z.string().min(2, "Как к вам обращаться?"),
  phone: z
    .string()
    .min(10, "Похоже на неполный номер")
    .regex(/^[0-9+()\-\s]+$/u, "Только цифры и + ( ) -"),
  comment: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласие на обработку ПД" }),
  }),
});

type ContactsForm = z.infer<typeof contactsSchema>;

export function Booking() {
  const { intent, setIntent } = useBooking();
  const schedule = useMemo(() => generateSchedule(14), []);

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | undefined>(intent.serviceId);
  const [date, setDate] = useState<string | undefined>(intent.date);
  const [time, setTime] = useState<string | undefined>(intent.time);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function goToStep(next: number) {
    setStep(next);
    queueMicrotask(() => {
      const el = cardRef.current;
      if (!el) return;
      const navH = window.innerWidth < 768 ? 72 : 88;
      const y = el.getBoundingClientRect().top + window.scrollY - navH;
      if (window.scrollY > y + 8) {
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactsForm>({ resolver: zodResolver(contactsSchema) });

  useEffect(() => {
    if (intent.serviceId) setServiceId(intent.serviceId);
    if (intent.date) setDate(intent.date);
    if (intent.time) setTime(intent.time);
    if (intent.serviceId && !done) setStep(1);
    if (intent.date && intent.time && !done) setStep(2);
  }, [intent, done]);

  const service = services.find((s) => s.id === serviceId);
  const activeDay = schedule.find((d) => d.date === date);

  const steps = ["Программа", "Дата и время", "Контакты"];

  function resetAll() {
    setServiceId(undefined);
    setDate(undefined);
    setTime(undefined);
    setStep(0);
    setDone(false);
    setIntent({});
    reset();
  }

  function onSubmitContacts(data: ContactsForm) {
    if (!service || !date || !time) return;
    saveBooking({
      serviceId: service.id,
      serviceName: service.name,
      date,
      time,
      name: data.name,
      phone: data.phone,
      comment: data.comment,
    });
    setDone(true);
  }

  return (
    <section id="booking" className="relative overflow-hidden py-16 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <span className="label-kicker">Запись</span>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] text-ink sm:text-4xl md:text-6xl md:leading-tight">
              Три шага.<br />
              <span className="italic text-copper">Никаких звонков.</span>
            </h2>
            <p className="mt-5 text-base text-ink/70 sm:text-lg md:mt-6">
              Выберите программу, удобный слот и оставьте контакт. Мастер пришлёт
              подтверждение и точный адрес в мессенджер в течение пары часов.
            </p>

            <div className="mt-10 space-y-5">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full font-display text-lg transition",
                      i < step || done
                        ? "bg-ink text-sand-100"
                        : i === step
                          ? "bg-copper text-sand-50"
                          : "border border-ink/20 text-ink/40",
                    )}
                  >
                    {i < step || done ? <Check size={16} /> : i + 1}
                  </div>
                  <div className={cn("text-lg", i === step ? "text-ink" : "text-ink/50")}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div ref={cardRef} className="card scroll-mt-20 overflow-hidden p-5 sm:p-6 md:p-10">
              <AnimatePresence mode="wait">
                {done ? (
                  <Success key="done" onNew={resetAll} service={service?.name} date={date} time={time} />
                ) : step === 0 ? (
                  <StepService
                    key="s0"
                    selected={serviceId}
                    onSelect={(id) => {
                      setServiceId(id);
                      goToStep(1);
                    }}
                  />
                ) : step === 1 ? (
                  <StepSlot
                    key="s1"
                    schedule={schedule}
                    selectedDate={date}
                    selectedTime={time}
                    onBack={() => goToStep(0)}
                    onPick={(d, t) => {
                      setDate(d);
                      setTime(t);
                      goToStep(2);
                    }}
                  />
                ) : (
                  <StepContacts
                    key="s2"
                    service={service?.name}
                    dayLabel={activeDay ? `${activeDay.weekday}, ${activeDay.label}` : date}
                    time={time}
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onBack={() => goToStep(1)}
                    onSubmit={handleSubmit(onSubmitContacts)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepService({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="label-kicker">Шаг 1 из 3</div>
      <h3 className="font-display text-2xl text-ink sm:text-3xl">Выберите программу</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition",
              selected === s.id
                ? "border-copper bg-copper/5"
                : "border-ink/10 hover:border-copper/50 hover:bg-sand-50",
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl text-ink">{s.name}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-ink/50">
                  {s.subtitle}
                </div>
              </div>
              <div className="font-display text-lg text-copper">
                {s.price.toLocaleString("ru-RU")} ₽
              </div>
            </div>
            <div className="mt-3 text-xs text-ink/60">
              {s.duration} мин · {s.effect}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function StepSlot({
  schedule,
  selectedDate,
  selectedTime,
  onBack,
  onPick,
}: {
  schedule: ReturnType<typeof generateSchedule>;
  selectedDate?: string;
  selectedTime?: string;
  onBack: () => void;
  onPick: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState<string>(selectedDate ?? schedule[0].date);
  const [time, setTime] = useState<string | undefined>(selectedTime);
  const day = schedule.find((d) => d.date === date)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      <div className="label-kicker">Шаг 2 из 3</div>
      <h3 className="font-display text-2xl text-ink sm:text-3xl">Когда вам удобно?</h3>

      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {schedule.map((d) => (
          <button
            key={d.date}
            onClick={() => {
              setDate(d.date);
              setTime(undefined);
            }}
            className={cn(
              "flex min-w-[76px] shrink-0 snap-start flex-col items-center rounded-2xl border px-3 py-3 transition active:scale-95",
              date === d.date
                ? "border-copper bg-copper text-sand-50 shadow-glow"
                : "border-ink/10 text-ink hover:border-copper/50",
            )}
          >
            <span className="text-[11px] uppercase tracking-widest">{d.weekday}</span>
            <span className="mt-1 font-display text-2xl leading-none">{d.label.split(" ")[0]}</span>
            <span className="mt-0.5 text-[10px] opacity-70">{d.label.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {day.slots.map((s) => (
          <button
            key={s.time}
            disabled={s.booked}
            onClick={() => setTime(s.time)}
            className={cn(
              "min-h-[48px] rounded-xl border px-3 py-3 text-base font-medium transition active:scale-95",
              s.booked
                ? "border-ink/5 bg-sand-50 text-ink/30 line-through cursor-not-allowed active:scale-100"
                : time === s.time
                  ? "border-ink bg-ink text-sand-100"
                  : "border-ink/15 text-ink hover:border-copper",
            )}
          >
            {s.time}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button onClick={onBack} className="btn-ghost">
          <ChevronLeft size={16} /> Назад
        </button>
        <button
          disabled={!time}
          onClick={() => time && onPick(date, time)}
          className={cn(
            "btn-primary",
            !time && "opacity-40 cursor-not-allowed pointer-events-none",
          )}
        >
          Продолжить <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function StepContacts({
  service,
  dayLabel,
  time,
  register,
  errors,
  isSubmitting,
  onBack,
  onSubmit,
}: {
  service?: string;
  dayLabel?: string;
  time?: string;
  register: ReturnType<typeof useForm<ContactsForm>>["register"];
  errors: ReturnType<typeof useForm<ContactsForm>>["formState"]["errors"];
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      <div className="label-kicker">Шаг 3 из 3</div>
      <h3 className="font-display text-2xl text-ink sm:text-3xl">Как с вами связаться?</h3>

      <div className="rounded-2xl bg-sand-50 p-4 text-sm text-ink/75">
        <div className="font-display text-ink">{service}</div>
        <div className="mt-1">
          {dayLabel} · {time}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-kicker mb-2 block">Имя</label>
          <input
            className="input"
            placeholder="Ваше имя"
            autoComplete="name"
            autoCapitalize="words"
            {...register("name")}
          />
          {errors.name && <p className="mt-1.5 text-sm text-coral">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label-kicker mb-2 block">Телефон</label>
          <input
            className="input"
            placeholder="+7 (___) ___-__-__"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1.5 text-sm text-coral">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="label-kicker mb-2 block">Комментарий (опционально)</label>
        <textarea
          className="input"
          rows={3}
          placeholder="Пожелания, зоны работы, противопоказания"
          {...register("comment")}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink/70">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-copper" {...register("consent")} />
        <span>
          Согласен(а) с{" "}
          <a href="#" className="text-copper underline">
            политикой обработки персональных данных
          </a>
          .
        </span>
      </label>
      {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-ghost">
          <ChevronLeft size={16} /> Назад
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          Отправить заявку <Sparkles size={16} />
        </button>
      </div>
    </motion.form>
  );
}

function Success({
  service,
  date,
  time,
  onNew,
}: {
  service?: string;
  date?: string;
  time?: string;
  onNew: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-10 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 8, -6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-ink text-copper"
      >
        <Check size={32} />
      </motion.div>
      <div>
        <h3 className="font-display text-3xl text-ink">Заявка принята</h3>
        <p className="mt-3 max-w-md text-ink/65">
          {service} — {date} в {time}. Мастер свяжется с вами для подтверждения и пришлёт
          точный адрес.
        </p>
      </div>
      <button onClick={onNew} className="btn-outline">
        Записаться ещё
      </button>
    </motion.div>
  );
}
