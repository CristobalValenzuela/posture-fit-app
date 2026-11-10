import React, { useEffect, useRef } from "react";
import { type ExerciseStep } from "../data/routinePlan";
import { ExerciseIllustration } from "./workout/ExerciseIllustration";
import { Flame, Lightbulb } from "lucide-react";

interface ExercisesViewProps {
  exercises: ExerciseStep[];
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
  onNavigateToToday: () => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  exercises,
  selectedExerciseId,
  setSelectedExerciseId,
  onNavigateToToday,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedExerciseId) {
      // Un pequeño retraso para asegurar que el DOM se haya renderizado por completo
      const timer = setTimeout(() => {
        const element = document.getElementById(
          `exercise-card-${selectedExerciseId}`,
        );
        if (element && scrollContainerRef.current) {
          // Calculamos la posición del elemento respecto al contenedor con scroll interno
          const container = scrollContainerRef.current;
          const containerTop = container.getBoundingClientRect().top;
          const elementTop = element.getBoundingClientRect().top;
          const scrollOffset = elementTop - containerTop + container.scrollTop;

          container.scrollTo({
            top: scrollOffset - 12, // Margen superior de cortesía de 12px
            behavior: "smooth",
          });
        }
        // Limpiamos el ID para evitar saltos molestos si el usuario cambia de pestaña y regresa
        setSelectedExerciseId(null);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedExerciseId, setSelectedExerciseId]);

  return (
    // Contenedor full flexible que ocupa todo el espacio disponible del main
    <div className="w-full h-full flex flex-col overflow-hidden pb-24 relative">
      {/* SECCIÓN ESTÁTICA SUPERIOR (No se mueve con el scroll) */}
      <div className="pb-3.5 z-10 shrink-0 select-none">
        <span className="text-xs font-semibold text-emerald-400">
          Enciclopedia Personal
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Guía Técnica Postural
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Revisa la biomecánica y claves de cada movimiento antes de dormir
        </p>
      </div>

      {/* ÁREA DE TARJETAS AZULES CON SCROLL INTERNO INDEPENDIENTE */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-0.5 mt-1 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }} // Scroll fluido en iOS
      >
        {exercises.map((ex, idx) => {
          // Identificamos si es la tarjeta a la que se le hizo clic en "Hoy"
          const isTarget = ex.id === selectedExerciseId;

          return (
            <div
              key={ex.id}
              id={`exercise-card-${ex.id}`}
              className={`bg-[#121B2E] border rounded-2xl p-4 space-y-3 transition-all duration-500 ${
                isTarget
                  ? "border-emerald-400 bg-[#16253F] ring-1 ring-emerald-500/20"
                  : "border-slate-800"
              }`}
            >
              {/* Encabezado del Ejercicio */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Ejercicio 0{idx + 1} • {ex.muscleTag}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-400">{ex.subtitle}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-full shrink-0">
                  {ex.sets} ×{" "}
                  {ex.mode === "timer" ? `${ex.durationSec}s` : ex.repsLabel}
                </span>
              </div>

              {/* Contenedor del Video / Imagen Cinematográfica */}
              <div className="bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800/40">
                <ExerciseIllustration exerciseId={ex.id} />
              </div>

              {/* Claves de postura técnicas */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
                <div className="text-[11px] font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Instrucciones de
                  Ejecución
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {ex.cues.map((cue, cIdx) => {
                    const [boldPart, restPart] = cue.includes(":")
                      ? cue.split(":")
                      : ["", cue];
                    return (
                      <li
                        key={cIdx}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-emerald-400 font-bold shrink-0">
                          •
                        </span>
                        <span>
                          {boldPart && (
                            <strong className="text-white">{boldPart}:</strong>
                          )}
                          {restPart}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tips de Respiración Clínica */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                  RESPIRACIÓN
                </span>
                <p className="text-xs text-slate-300 leading-normal">
                  {ex.breathingTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN FLOTANTE ERGONÓMICO "VOLVER A HOY" */}
      <div className="absolute bottom-4 right-2 z-30">
        <button
          onClick={onNavigateToToday}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-full font-bold text-xs shadow-xl shadow-emerald-950/50 transition active:scale-95"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>Volver a Hoy</span>
        </button>
      </div>
    </div>
  );
};
