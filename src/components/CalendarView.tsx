import React, { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type SessionRecord } from "../db/database";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
  Timer,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface CalendarViewProps {
  startDate: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ startDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const sessions = useLiveQuery(() => db.sessions.toArray(), []) || [];

  const sessionMap = useMemo(() => {
    const map = new Map<string, SessionRecord>();
    sessions.forEach((s) => map.set(s.date, s));
    return map;
  }, [sessions]);

  // Cálculos de Racha y Estadísticas Mensuales
  const stats = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split("T")[0];

    let completedInMonth = 0;
    let totalMinutesInMonth = 0;
    let elapsedDaysInMonth = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (dateStr >= startDate && dateStr <= todayStr) {
        elapsedDaysInMonth++;
        const rec = sessionMap.get(dateStr);
        if (rec?.status === "completed") {
          completedInMonth++;
          totalMinutesInMonth += Math.round(rec.durationSeconds / 60);
        }
      }
    }

    // Cálculo de racha actual
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const dStr = cursor.toISOString().split("T")[0];
      if (sessionMap.get(dStr)?.status === "completed") {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (dStr === todayStr) {
        // Si hoy aún no se entrena, revisar desde ayer
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    const successRate =
      elapsedDaysInMonth > 0
        ? Math.round((completedInMonth / elapsedDaysInMonth) * 100)
        : 0;

    return {
      streak,
      completedInMonth,
      elapsedDaysInMonth,
      successRate,
      totalMinutesInMonth,
    };
  }, [currentMonth, sessionMap, startDate]);

  // Construcción de la grilla del mes (Lun - Dom)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Lunes = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split("T")[0];

    const cells: Array<{
      day: number | null;
      dateStr?: string;
      status?: "completed" | "missed" | "future" | "today";
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) cells.push({ day: null });

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const record = sessionMap.get(dateStr);

      let status: "completed" | "missed" | "future" | "today" = "future";
      if (record?.status === "completed") status = "completed";
      else if (dateStr === todayStr) status = "today";
      else if (dateStr >= startDate && dateStr < todayStr) status = "missed";

      cells.push({ day: d, dateStr, status });
    }
    return cells;
  }, [currentMonth, sessionMap, startDate]);

  const selectedSession = sessionMap.get(selectedDate);
  const monthLabel = currentMonth.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* Encabezado y Navegación de Mes */}
      <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
              ),
            )
          }
          className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold capitalize text-base">{monthLabel}</span>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
              ),
            )
          }
          className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tarjetas de Resumen (Racha, Éxito Mes, Sesiones) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-1 text-amber-400 text-xs font-medium mb-1">
            <Flame className="w-3.5 h-3.5" /> Racha
          </div>
          <div className="text-xl font-bold">{stats.streak} d</div>
          <div className="text-[11px] text-slate-400">Ininterrumpida</div>
        </div>

        <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Éxito Mes
          </div>
          <div className="text-xl font-bold">{stats.successRate}%</div>
          <div className="text-[11px] text-slate-400">
            {stats.completedInMonth} de {stats.elapsedDaysInMonth} d
          </div>
        </div>

        <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-1 text-sky-400 text-xs font-medium mb-1">
            <Timer className="w-3.5 h-3.5" /> Sesiones
          </div>
          <div className="text-xl font-bold">{stats.completedInMonth}</div>
          <div className="text-[11px] text-slate-400">
            {stats.totalMinutesInMonth} min tot
          </div>
        </div>
      </div>

      {/* Grilla del Calendario */}
      <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/50">
        <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium mb-3">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((cell, idx) => {
            if (!cell.day || !cell.dateStr)
              return <div key={idx} className="h-10" />;

            const isSelected = cell.dateStr === selectedDate;
            let style = "bg-slate-900/50 text-slate-500";
            if (cell.status === "completed")
              style =
                "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
            if (cell.status === "missed")
              style = "bg-rose-500/15 text-rose-300 border border-rose-500/40";
            if (cell.status === "today")
              style = "bg-slate-700 text-white border-2 border-emerald-400";

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr!)}
                className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition ${style} ${
                  isSelected ? "ring-2 ring-white scale-105" : ""
                }`}
              >
                <span>{cell.day}</span>
                {cell.status === "completed" && (
                  <Check className="w-3 h-3 text-emerald-400" />
                )}
                {cell.status === "missed" && (
                  <X className="w-3 h-3 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{" "}
            Completado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Omitido
          </span>
        </div>
      </div>

      {/* Detalle del Día Seleccionado */}
      <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/50">
        <div className="text-sm font-semibold text-slate-200 mb-2">
          {selectedDate}
        </div>
        {selectedSession ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span>
                Finalizada a las {selectedSession.completedAt} • Rutina Nocturna
              </span>
              <span>
                {Math.floor(selectedSession.durationSeconds / 60)}m{" "}
                {selectedSession.durationSeconds % 60}s
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Sensación:{" "}
                <strong className="text-white">
                  {selectedSession.feeling === "relieved"
                    ? "Columna aliviada"
                    : selectedSession.feeling === "mild_tension"
                      ? "Tensión leve"
                      : "Molestia en hombro"}
                </strong>
              </span>
            </div>
            {selectedSession.notes && (
              <p className="text-slate-400 italic">"{selectedSession.notes}"</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No hay sesión registrada en esta fecha.
          </p>
        )}
      </div>
    </div>
  );
};
