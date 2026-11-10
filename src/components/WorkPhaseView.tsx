import React from "react";
import { type ExerciseStep } from "../data/routinePlan";
import {
  ArrowLeft,
  CheckCircle2,
  Hand,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipForward,
  Sparkles,
  Wind,
  X,
} from "lucide-react";
import { ExerciseIllustration } from "./workout/ExerciseIllustration";

interface WorkPhaseViewProps {
  exercise: ExerciseStep;
  exIndex: number;
  totalExercises: number;
  setNumber: number;
  secondsLeft: number;
  isPaused: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onTogglePause: () => void;
  onAdjustTime: (delta: number) => void;
  onCompleteSet: () => void;
}

export const WorkPhaseView: React.FC<WorkPhaseViewProps> = ({
  exercise,
  exIndex,
  totalExercises,
  setNumber,
  secondsLeft,
  isPaused,
  isLastStep,
  onBack,
  onTogglePause,
  onAdjustTime,
  onCompleteSet,
}) => {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Cálculo del anillo circular SVG
  const totalSec = exercise.durationSec || 25;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progressRatio =
    exercise.mode === "timer"
      ? Math.max(0, Math.min(1, secondsLeft / totalSec))
      : 1;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const cueIcons = [CheckCircle2, Wind, Hand];
  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 p-5 max-w-md mx-auto flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Ejercicio {exIndex + 1} de {totalExercises} • Serie {setNumber}/
              {exercise.sets}
            </span>
          </div>

          {/* Título */}
          <div>
            <span className="text-xs font-semibold text-emerald-400">
              {exercise.muscleTag}
            </span>
            <h1 className="text-xl font-bold text-white mt-0.5">
              {exercise.name}
            </h1>
            <p className="text-xs text-slate-400">{exercise.subtitle}</p>
          </div>

          {/* Tarjeta Ilustración Anatómica (como en captura 2) */}
          <div className="bg-[#121B2E] border border-slate-800 rounded-2xl p-3 relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Alineación
                y Descompresión
              </span>
              <span className="text-emerald-400 font-medium text-[11px]">
                Tracción por Gravedad
              </span>
            </div>

            <div className="bg-gradient-to-b from-slate-900/80 to-emerald-950/20 rounded-xl flex items-center justify-center relative">
              <ExerciseIllustration exerciseId={exercise.id} />
              <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                {exercise.mode === "timer"
                  ? "0.5 cm Elongación"
                  : "Control Escapular"}
              </span>
            </div>
          </div>

          {/* Tarjeta Temporizador Circular SVG */}
          <div className="bg-[#121B2E] border border-slate-800 rounded-3xl p-5 flex flex-col items-center">
            {exercise.mode === "timer" ? (
              <>
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 160 160"
                  >
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
                      stroke="#34D399"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Tiempo Restante
                    </span>
                    <span className="text-4xl font-extrabold text-white tabular-nums my-0.5">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-400">
                      • Fase Isométrica
                    </span>
                  </div>
                </div>

                {/* Botones redondos -5s, Píldora Pausar, +5s */}
                <div className="flex items-center justify-center gap-4 mt-3 w-full">
                  <button
                    onClick={() => onAdjustTime(-5)}
                    className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300"
                    title="-5 segundos"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onTogglePause}
                    className="flex-1 max-w-[170px] py-3 rounded-full bg-[#4ADE80] hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4 fill-current" />
                    ) : (
                      <Pause className="w-4 h-4 fill-current" />
                    )}
                    {isPaused ? "Reanudar" : "Pausar"}
                  </button>

                  <button
                    onClick={() => onAdjustTime(5)}
                    className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300"
                    title="+5 segundos"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-5 text-center space-y-1">
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Objetivo de Serie
                </div>
                <div className="text-4xl font-extrabold text-emerald-400">
                  {exercise.repsLabel}
                </div>
                <div className="text-xs text-slate-400">
                  Ejecuta lento y controlado (RIR 3-4)
                </div>
              </div>
            )}
          </div>

          {/* Claves de Postura con cajas individuales por punto */}
          <div className="bg-[#121B2E] border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> Claves de
                Postura
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Técnica Pura
              </span>
            </div>

            <div className="space-y-2">
              {exercise.cues.map((cue, idx) => {
                const Icon = cueIcons[idx % cueIcons.length];
                const [boldPart, restPart] = cue.includes(":")
                  ? cue.split(":")
                  : ["", cue];

                return (
                  <div
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-2.5 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="leading-relaxed">
                      {boldPart && (
                        <strong className="text-white">{boldPart}:</strong>
                      )}
                      {restPart}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Footer Doble Botón idéntico a captura 2 */}
        <div className="w-full grid grid-cols-5 gap-2.5 pt-4">
          <button
            onClick={onCompleteSet}
            className="col-span-3 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <SkipForward className="w-4 h-4 text-emerald-400" />
            <span>{isLastStep ? "Completar" : "Siguiente Serie"}</span>
          </button>

          <button
            onClick={onBack}
            className="col-span-2 py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-semibold text-sm flex items-center justify-center gap-1.5 transition"
          >
            <X className="w-4 h-4" />
            <span>Finalizar</span>
          </button>
        </div>
      </div>
    </>
  );
};
