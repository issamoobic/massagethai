const BOOKINGS_KEY = "massagethai:bookings";

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment?: string;
  createdAt: string;
};

export function saveBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
  const record: Booking = {
    ...booking,
    id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const raw = localStorage.getItem(BOOKINGS_KEY);
  const list: Booking[] = raw ? JSON.parse(raw) : [];
  list.push(record);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  // eslint-disable-next-line no-console
  console.info("[booking] saved", record);
  return record;
}

export function getBookings(): Booking[] {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function isSlotBooked(date: string, time: string): boolean {
  return getBookings().some((b) => b.date === date && b.time === time);
}
