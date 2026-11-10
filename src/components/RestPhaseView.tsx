import React from "react";
import { type ExerciseStep } from "../data/routinePlan";
import {
  ArrowLeft,
  Play,
  SkipForward,
  Wind,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface RestPhaseViewProps {
  completedSet: number;
  totalRestSeconds: number;
  secondsLeft: number;
  breathingTip: string;
  nextExercise?: ExerciseStep;
  nextSetNumber: number;
  onBack: () => void;
  onAddTenSeconds: () => void;
  onSkipRest: () => void;
}

export const RestPhaseView: React.FC<RestPhaseViewProps> = ({
  completedSet,
  totalRestSeconds,
  secondsLeft,
  breathingTip,
  nextExercise,
  nextSetNumber,
  onBack,
  onAddTenSeconds,
  onSkipRest,
}) => {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Anillo circular SVG Ámbar
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(
    0,
    Math.min(1, secondsLeft / Math.max(1, totalRestSeconds)),
  );
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 p-4 max-w-md mx-auto flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-base text-white">
              Descanso Activo
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 px-3 py-1.5 rounded-full border border-amber-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Serie{" "}
            {completedSet} lista
          </span>
        </div>

        {/* Anillo Circular Ámbar */}
        <div className="bg-[#121B2E] border border-slate-800 rounded-3xl p-5 flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#1E293B"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#F59E0B"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Recuperación
              </span>
              <span className="text-4xl font-extrabold text-white tabular-nums my-0.5">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                • Relaja hombros
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-3">
            <button
              onClick={onAddTenSeconds}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300"
            >
              +10s descanso
            </button>
            <button
              onClick={onSkipRest}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" /> Omitir descanso
            </button>
          </div>
        </div>

        {/* Tarjeta Respiración Guiada */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">
              Respiración Guiada (4s - 4s)
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {breathingTip}
            </p>
          </div>
        </div>

        {/* Vista Previa Siguiente Serie */}
        {nextExercise && (
          <div className="bg-[#121B2E] border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> A continuación
              </span>
              <span className="text-slate-400 font-medium">
                Serie {nextSetNumber} de {nextExercise.sets}
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {nextExercise.name}
            </div>
            <div className="text-xs text-emerald-300 font-semibold">
              {nextExercise.mode === "timer"
                ? `${nextExercise.durationSec} segundos`
                : nextExercise.repsLabel}
            </div>
            <p className="text-xs text-slate-400 pt-1.5 border-t border-slate-800">
              {nextExercise.cues[0]}
            </p>
          </div>
        )}
      </div>

      {/* Botón Iniciar Siguiente Serie */}
      <button
        onClick={onSkipRest}
        className="w-full py-4 rounded-2xl bg-[#4ADE80] hover:bg-emerald-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
      >
        <Play className="w-5 h-5 fill-current" /> Empezar Serie {nextSetNumber}{" "}
        Ahora
      </button>
    </div>
  );
};
