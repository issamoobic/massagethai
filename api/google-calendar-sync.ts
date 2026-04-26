import { google } from "googleapis";

type BookingPayload = {
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  name: string;
  phone: string;
  comment?: string;
};

function addMinutes(date: string, time: string, minutes: number) {
  const [yy, mm, dd] = date.split("-").map(Number);
  const [hh, min] = time.split(":").map(Number);
  const dt = new Date(Date.UTC(yy, mm - 1, dd, hh, min + minutes, 0, 0));
  const outDate = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(
    dt.getUTCDate(),
  ).padStart(2, "0")}`;
  const outTime = `${String(dt.getUTCHours()).padStart(2, "0")}:${String(dt.getUTCMinutes()).padStart(2, "0")}:00`;
  return `${outDate}T${outTime}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method Not Allowed" });
    return;
  }

  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_CALENDAR_ID,
    BOOKING_TIMEZONE = "Asia/Novosibirsk",
  } = process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
    res.status(500).json({
      ok: false,
      message: "Google Calendar env vars are not configured",
    });
    return;
  }

  const body = req.body as BookingPayload;
  if (!body?.serviceName || !body?.date || !body?.time || !body?.name || !body?.phone || !body?.durationMinutes) {
    res.status(400).json({ ok: false, message: "Invalid booking payload" });
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    const startDateTime = `${body.date}T${body.time}:00`;
    const endDateTime = addMinutes(body.date, body.time, body.durationMinutes);

    const event = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Новая запись: ${body.serviceName}`,
        description: [
          `Клиент: ${body.name}`,
          `Телефон: ${body.phone}`,
          body.comment ? `Комментарий: ${body.comment}` : "Комментарий: —",
          "",
          "Источник: сайт massagethai",
        ].join("\n"),
        start: {
          dateTime: startDateTime,
          timeZone: BOOKING_TIMEZONE,
        },
        end: {
          dateTime: endDateTime,
          timeZone: BOOKING_TIMEZONE,
        },
      },
    });

    res.status(200).json({ ok: true, eventId: event.data.id });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("[google-calendar-sync] failed", error?.message || error);
    res.status(500).json({
      ok: false,
      message: "Failed to sync booking to Google Calendar",
    });
  }
}
