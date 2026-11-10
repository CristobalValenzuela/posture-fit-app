import { useState, useEffect } from "react";
import { type SessionRecord } from "../db/database";
import { type ExerciseStep } from "../data/routinePlan";
import {
  PlayCircle,
  Check,
  ChevronRight,
  Flame,
  Clock,
  Bell,
  CalendarPlus,
} from "lucide-react";
import {
  getReminderSettings,
  saveReminderSettings,
  triggerNightlyNotification,
  downloadDailyCalendarInvite,
} from "../utils/reminder";

interface TodayViewProps {
  exercises: ExerciseStep[];
  sessions: SessionRecord[];
  isTodayCompleted: boolean;
  onStartWorkout: () => void;
  onSelectExercise: (id: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  exercises,
  sessions,
  isTodayCompleted,
  onStartWorkout,
  onSelectExercise,
}) => {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("21:00");
  const completedDates = new Set(
    sessions.filter((s) => s.status === "completed").map((s) => s.date),
  );

  // Construir los 7 días de la semana actual (Lunes a Domingo)
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // Lunes = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = dayLabels.map((label, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = dateStr === today.toISOString().split("T")[0];
    const isDone = completedDates.has(dateStr);
    return { label, dayNum: d.getDate(), dateStr, isToday, isDone };
  });

  const weeklyDoneCount = weekDays.filter((d) => d.isDone).length;
  const weeklyPercent = Math.round((weeklyDoneCount / 7) * 100);

  useEffect(() => {
    getReminderSettings().then((cfg) => {
      setReminderEnabled(cfg.enabled);
      setReminderTime(cfg.time);
    });
  }, []);

  useEffect(() => {
    if (!reminderEnabled || isTodayCompleted) return;
    const interval = setInterval(() => {
      const nowHHMM = new Date().toTimeString().slice(0, 5);
      if (nowHHMM === reminderTime) {
        triggerNightlyNotification();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [reminderEnabled, reminderTime, isTodayCompleted]);

  const handleToggleReminder = async () => {
    const nextState = !reminderEnabled;
    const ok = await saveReminderSettings(nextState, reminderTime);
    setReminderEnabled(ok && nextState);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Saludo y Título */}
      <div>
        <span className="text-xs font-medium text-emerald-400">
          Ritual de descompresión
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Rutina Nocturna
        </h1>
        <p className="text-xs text-slate-400">
          Alineación torácica y barra • ~15 min
        </p>
      </div>
      {/* Tira Semanal de Consistencia (L M X J V S D) */}
      <div className="bg-[#121B2E] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Consistencia Semanal
          </span>
          <span className="font-bold text-emerald-400">
            {weeklyPercent}% ({weeklyDoneCount}/7 días)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((d) => (
            <div
              key={d.dateStr}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 border ${
                d.isDone
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : d.isToday
                    ? "bg-slate-800 border-emerald-400 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-500"
              }`}
            >
              <span className="text-[10px] font-bold">{d.label}</span>
              {d.isDone ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              ) : (
                <span className="w-5 h-5 flex items-center justify-center text-xs font-semibold">
                  {d.dayNum}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#121B2E] border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl ${reminderEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}
          >
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              Recordatorio Nocturno
              <input
                type="time"
                value={reminderTime}
                onChange={async (e) => {
                  setReminderTime(e.target.value);
                  await saveReminderSettings(reminderEnabled, e.target.value);
                }}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-emerald-400 font-semibold"
              />
            </div>
            <button
              onClick={() => downloadDailyCalendarInvite(reminderTime)}
              className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 mt-0.5"
            >
              <CalendarPlus className="w-3 h-3" /> Agendar alarma diaria en
              celular (.ics)
            </button>
          </div>
        </div>

        <button
          onClick={handleToggleReminder}
          className={`w-11 h-6 rounded-full transition p-0.5 ${reminderEnabled ? "bg-emerald-500" : "bg-slate-700"}`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${reminderEnabled ? "translate-x-5" : ""}`}
          />
        </button>
      </div>
      {/* Botón Principal CTA */}
      <button
        onClick={onStartWorkout}
        className="w-full py-4 px-5 rounded-2xl bg-[#4ADE80] hover:bg-emerald-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition"
      >
        <PlayCircle className="w-6 h-6" />
        {isTodayCompleted
          ? "Repetir Rutina de Hoy"
          : "Iniciar Rutina de Hoy (15 min)"}
      </button>
      {/* Lista de Ejercicios de la Sesión */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-200">
            Secuencia de Hoy ({exercises.length} ejercicios)
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 30s descanso
          </span>
        </div>

        {exercises.map((ex, idx) => (
          <div
            key={ex.id}
            onClick={() => onSelectExercise(ex.id)}
            className="bg-[#121B2E] border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-extrabold text-emerald-400 shrink-0">
              0{idx + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">
                {ex.name}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {ex.subtitle}
              </div>
              <div className="inline-block text-[11px] text-emerald-400 mt-1 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {ex.sets} series •{" "}
                {ex.mode === "timer" ? `${ex.durationSec} seg` : ex.repsLabel}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isTodayCompleted && (
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
