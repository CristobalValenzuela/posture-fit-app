import Dexie, { type Table } from "dexie";

export interface SessionRecord {
  date: string; // 'YYYY-MM-DD' (Clave primaria)
  status: "completed" | "missed";
  completedAt: string; // ej: '22:15'
  durationSeconds: number;
  exercisesCompleted: number;
  totalExercises: number;
  feeling: "relieved" | "mild_tension" | "shoulder_discomfort";
  rating: number; // 1 a 5 estrellas
  notes: string;
  hangSecondsAccumulated: number; // Para el hito de "Tiempo Colgado"
}

export interface AppSetting {
  key: string;
  value: string;
}

class PosturaFitDB extends Dexie {
  sessions!: Table<SessionRecord, string>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super("PosturaFitDB");
    this.version(1).stores({
      sessions: "date, status, feeling",
      settings: "key",
    });
  }
}

export const db = new PosturaFitDB();

export async function getOrInitStartDate(): Promise<string> {
  const saved = await db.settings.get("startDate");
  if (saved) return saved.value;
  const today = new Date().toISOString().split("T")[0];
  await db.settings.put({ key: "startDate", value: today });
  return today;
}
