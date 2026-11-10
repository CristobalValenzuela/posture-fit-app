import { db } from "../db/database";

export async function getReminderSettings(): Promise<{
  enabled: boolean;
  time: string;
}> {
  const enabledRow = await db.settings.get("reminderEnabled");
  const timeRow = await db.settings.get("reminderTime");
  return {
    enabled: enabledRow?.value === "true",
    time: timeRow?.value || "21:00",
  };
}

export async function saveReminderSettings(
  enabled: boolean,
  time: string,
): Promise<boolean> {
  if (enabled && "Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      await db.settings.put({ key: "reminderEnabled", value: "false" });
      return false;
    }
  }

  await db.settings.put({ key: "reminderEnabled", value: String(enabled) });
  await db.settings.put({ key: "reminderTime", value: time });
  return true;
}

export function triggerNightlyNotification(): void {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🌙 PosturaFit • Hora de tu Rutina Nocturna", {
      body: "15 minutos de barra y descompresión antes de dormir.",
      icon: "/icon-192.png",
    });
  }
}

// Genera un archivo .ics para agendar alarma diaria nativa en iOS/Android
export function downloadDailyCalendarInvite(timeStr: string): void {
  const [hours, minutes] = timeStr.split(":");
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const dtStart = `${yyyy}${mm}${dd}T${hours}${minutes}00`;
  const endHour = String(Math.min(23, Number(hours))).padStart(2, "0");
  const endMin = String(Math.min(59, Number(minutes) + 15)).padStart(2, "0");
  const dtEnd = `${yyyy}${mm}${dd}T${endHour}${endMin}00`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PosturaFit//Rutina Nocturna//ES",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "RRULE:FREQ=DAILY;COUNT=84",
    "SUMMARY:PosturaFit - Rutina Postural Nocturna (15 min)",
    "DESCRIPTION:Colgado pasivo en barra, estiramiento pectoral y retracciones escapulares.",
    "BEGIN:VALARM",
    "TRIGGER:-PT5M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio PosturaFit",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "posturafit-recordatorio-diario.ics";
  a.click();
  URL.revokeObjectURL(url);
}
