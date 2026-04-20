import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Send, MessageCircle } from "lucide-react";

export function Contacts() {
  return (
    <section id="contacts" className="section-ink relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[1200px] -translate-x-1/2 rounded-full bg-coral/10 blur-3xl" />

      <div className="container-x relative z-10">
        <div className="grid gap-12 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <span className="label-kicker">Контакты</span>
            <h2 className="mt-3 font-display text-4xl text-sand-100 md:text-6xl md:leading-tight">
              Приходите в <span className="italic text-copper">тишину</span>
            </h2>
            <p className="mt-6 text-sand-200/75">
              Точный адрес высылаем после подтверждения записи — это часть нашей камерной
              атмосферы. Ориентир — центр Новосибирска, 5 минут от остановки
              общественного транспорта.
            </p>

            <div className="mt-10 space-y-5">
              <Item icon={<MapPin size={18} />} label="Адрес">
                Новосибирск, центр · точный адрес — после записи
              </Item>
              <Item icon={<Clock size={18} />} label="Часы работы">
                Ежедневно 10:00–22:00 · по записи
              </Item>
              <Item icon={<Phone size={18} />} label="Телефон">
                <a href="tel:+79831234567" className="hover:text-copper">
                  +7 (983) 123-45-67
                </a>
              </Item>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://vk.com/mnimenya_massage"
                target="_blank"
                rel="noreferrer"
                className="btn bg-sand-100 text-ink hover:bg-copper hover:text-sand-50"
              >
                <MessageCircle size={16} /> Сообщество ВК
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="btn border border-sand-100/30 text-sand-100 hover:border-copper hover:text-copper"
              >
                <Send size={16} /> Telegram
              </a>
              <a
                href="https://wa.me/79831234567"
                target="_blank"
                rel="noreferrer"
                className="btn border border-sand-100/30 text-sand-100 hover:border-copper hover:text-copper"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-3xl border border-sand-100/10 bg-sand-100">
              <iframe
                title="Карта Новосибирск, центр"
                src="https://yandex.ru/map-widget/v1/?ll=82.921500%2C55.030200&z=13&pt=82.921500,55.030200,pm2rdm"
                className="h-[480px] w-full"
                loading="lazy"
              />
            </div>
            <div className="mt-4 rounded-2xl border border-sand-100/10 bg-ink-700/40 p-4 text-sm text-sand-200/70">
              <span className="label-kicker !text-coral">Как добраться</span>
              <div className="mt-2">
                Ближайшее метро — «Площадь Ленина» (5 минут пешком). Парковка во дворе.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Item({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-copper/20 text-copper">
        {icon}
      </div>
      <div>
        <div className="label-kicker !text-coral">{label}</div>
        <div className="mt-1 text-sand-100">{children}</div>
      </div>
    </div>
  );
}
