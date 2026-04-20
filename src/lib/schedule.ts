export const SLOT_TIMES = [
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
  "20:30",
];

export type DaySchedule = {
  date: string;
  weekday: string;
  label: string;
  slots: { time: string; booked: boolean }[];
};

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function humanLabel(d: Date): string {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function generateSchedule(days = 14): DaySchedule[] {
  const result: DaySchedule[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = formatDate(d);
    const slots = SLOT_TIMES.map((t) => {
      const seed = hash(`${dateStr}:${t}`);
      const booked = seed < 0.45;
      return { time: t, booked };
    });
    result.push({
      date: dateStr,
      weekday: WEEKDAYS[d.getDay()],
      label: humanLabel(d),
      slots,
    });
  }
  return result;
}

export function getFreeSlots(limit = 5): { date: string; label: string; time: string }[] {
  const schedule = generateSchedule();
  const free: { date: string; label: string; time: string }[] = [];
  for (const day of schedule) {
    for (const slot of day.slots) {
      if (!slot.booked) {
        free.push({ date: day.date, label: `${day.weekday}, ${day.label}`, time: slot.time });
        if (free.length >= limit) return free;
      }
    }
  }
  return free;
}

export type UpcomingSlot = {
  date: string;
  label: string;
  time: string;
  datetime: Date;
  isToday: boolean;
  isTomorrow: boolean;
};

export function getNextUpcomingSlot(now: Date = new Date()): UpcomingSlot | null {
  const schedule = generateSchedule();
  const todayStr = formatDate(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  for (const day of schedule) {
    for (const slot of day.slots) {
      if (slot.booked) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const [yy, mm, dd] = day.date.split("-").map(Number);
      const slotDate = new Date(yy, mm - 1, dd, h, m, 0, 0);
      if (slotDate.getTime() - now.getTime() < 30 * 60 * 1000) continue;
      return {
        date: day.date,
        label: `${day.weekday}, ${day.label}`,
        time: slot.time,
        datetime: slotDate,
        isToday: day.date === todayStr,
        isTomorrow: day.date === tomorrowStr,
      };
    }
  }
  return null;
}

export function formatCountdown(target: Date, now: Date = new Date()): string {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalMin = Math.floor(diff / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const minutes = totalMin % 60;
  if (days > 0) return `через ${days} дн. ${hours} ч`;
  if (hours > 0) return `через ${hours} ч ${minutes} мин`;
  return `через ${minutes} мин`;
}
