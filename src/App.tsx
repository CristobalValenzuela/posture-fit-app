import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, getOrInitStartDate } from "./db/database";
import { getNightlyExercises } from "./data/routinePlan";
import { CalendarView } from "./components/CalendarView";
import { ActiveWorkoutView } from "./components/ActiveWorkoutView";
import { Flame, Calendar, Trophy, Dumbbell, Moon } from "lucide-react";
import { TodayView } from "./components/TodayView";
import { MilestonesView } from "./components/MilestonesView";
import { ExercisesView } from "./components/ExercisesView";

type Tab = "today" | "calendar" | "milestones" | "exercises";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [startDate, setStartDate] = useState<string>("");
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    getOrInitStartDate().then(setStartDate);
  }, []);

  const sessions = useLiveQuery(() => db.sessions.toArray(), []) || [];
  const todayStr = new Date().toISOString().split("T")[0];
  const isTodayCompleted = sessions.some(
    (s) => s.date === todayStr && s.status === "completed",
  );

  // Cálculo semana actual (1 a 12)
  const currentWeek = startDate
    ? Math.min(
        12,
        Math.max(
          1,
          Math.floor(
            (Date.now() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24 * 7),
          ) + 1,
        ),
      )
    : 1;

  const exercises = getNightlyExercises(currentWeek);

  if (!startDate) return <div className="min-h-screen bg-slate-900" />;

  if (isWorkoutActive) {
    return (
      <ActiveWorkoutView
        exercises={exercises}
        onClose={() => setIsWorkoutActive(false)}
        onFinished={() => {
          setIsWorkoutActive(false);
          setActiveTab("calendar");
        }}
      />
    );
  }

  return (
    // Contenedor maestro rígido: Bloquea el scroll general del navegador móvil
    <div className="h-screen w-full max-w-md mx-auto bg-slate-900 text-slate-100 flex flex-col overflow-hidden relative shadow-2xl">
      {/* Header Superior: 100% estático, no usa 'fixed' para no tapar el contenido */}
      <header className="w-full px-5 pt-6 pb-4 flex items-center justify-between shrink-0 bg-[#0B111E]/95 backdrop-blur z-30 border-b border-slate-800/40 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Moon className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">PosturaFit</span>
        </div>
        <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-amber-400 font-medium flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> Semana {currentWeek}/12
        </span>
      </header>

      {/* CONTENEDOR PRINCIPAL: Distribuye el espacio y aísla los scrolls */}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {/* PESTAÑA 1: HOY */}
        {activeTab === "today" && (
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 scroll-smooth">
            <TodayView
              exercises={exercises}
              sessions={sessions}
              isTodayCompleted={isTodayCompleted}
              onStartWorkout={() => setIsWorkoutActive(true)}
              onSelectExercise={(id: string) => {
                setSelectedExerciseId(id);
                setActiveTab("exercises");
              }}
            />
          </div>
        )}

        {/* PESTAÑA 2: CALENDARIO */}
        {activeTab === "calendar" && (
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
            <CalendarView startDate={startDate} />
          </div>
        )}

        {/* PESTAÑA 3: HITOS */}
        {activeTab === "milestones" && (
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
            <MilestonesView currentWeek={currentWeek} />
          </div>
        )}

        {/* PESTAÑA 4: GUÍA TÉCNICA (Ocupa de forma estricta todo el espacio interno) */}
        {activeTab === "exercises" && (
          <div className="flex-1 h-full px-5 pt-4 overflow-hidden">
            <ExercisesView
              exercises={exercises}
              selectedExerciseId={selectedExerciseId}
              setSelectedExerciseId={setSelectedExerciseId}
              onNavigateToToday={() => setActiveTab("today")}
            />
          </div>
        )}
      </main>

      {/* Navegación Inferior Móvil (Fija abajo) */}
      <nav className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur border-t border-slate-800 px-4 py-2.5 flex justify-around z-20 shrink-0">
        {[
          { id: "today", label: "Hoy", icon: Flame },
          { id: "calendar", label: "Calendario", icon: Calendar },
          { id: "milestones", label: "Hitos", icon: Trophy },
          { id: "exercises", label: "Ejercicios", icon: Dumbbell },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
                active
                  ? "text-emerald-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
