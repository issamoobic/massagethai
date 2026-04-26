export type CalendarSyncPayload = {
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  name: string;
  phone: string;
  comment?: string;
};

export async function syncBookingToGoogleCalendar(payload: CalendarSyncPayload): Promise<{ ok: boolean; message?: string }> {
  try {
    const resp = await fetch("/api/google-calendar-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await resp.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!resp.ok || !data.ok) {
      return { ok: false, message: data.message || "Ошибка синхронизации календаря" };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Сервер календаря недоступен" };
  }
}
