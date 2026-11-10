import React, { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import {
  Trophy,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Play,
  ShieldCheck,
} from "lucide-react";

interface MilestonesViewProps {
  currentWeek: number;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  currentWeek,
}) => {
  const sessions = useLiveQuery(() => db.sessions.toArray(), []) || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalSessionsCount = completedSessions.length;
  const totalHangMinutes = Math.round(
    completedSessions.reduce(
      (acc, s) => acc + (s.hangSecondsAccumulated || 75),
      0,
    ) / 60,
  );
  const overallPercent = Math.min(
    100,
    Math.round((totalSessionsCount / 64) * 100),
  );

  const phases = [
    {
      phase: "FASE 1 • SEMANAS 1-2",
      title: "Conciencia Postural",
      targetSessions: 12,
      minWeek: 1,
      maxWeek: 2,
      goals: [
        "Descompresión intervertebral nocturna diaria sin dolor.",
        "Agarre pasivo en barra: meta de 25-30s continuos sin apoyo.",
      ],
    },
    {
      phase: "FASE 2 • SEMANAS 3-4",
      title: "Movilidad Torácica & Escapular",
      targetSessions: 14,
      minWeek: 3,
      maxWeek: 4,
      goals: [
        "Rango activo de escápulas y reducción consciente de cifosis dorsal.",
        "Wall angels sin despegar zona lumbar (10-12 repeticiones limpias).",
      ],
    },
    {
      phase: "FASE 3 • SEMANAS 6-8",
      title: "Resistencia Muscular",
      targetSessions: 18,
      minWeek: 5,
      maxWeek: 8,
      goals: [
        "3 series x 12 retracciones escapulares estrictas en suspensión.",
        "Colgado pasivo descompresivo acumulado de 2 minutos.",
      ],
    },
    {
      phase: "FASE 4 • SEMANAS 10-12",
      title: "Cambio Visual & Hábitos",
      targetSessions: 20,
      minWeek: 9,
      maxWeek: 12,
      goals: [
        "Alineación occipucio-sacro permanente e inconsciente durante el día.",
        "Hombros alineados hacia atrás en reposo sin fatiga.",
      ],
    },
  ];

  // Exportar JSON local
  const handleExportJSON = async () => {
    const allSessions = await db.sessions.toArray();
    const allSettings = await db.settings.toArray();
    const payload = {
      exportedAt: new Date().toISOString(),
      settings: allSettings,
      sessions: allSessions,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `posturafit-respaldo-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage("Respaldo JSON descargado exitosamente.");
  };

  // Importar JSON local
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.sessions)) {
        await db.sessions.bulkPut(parsed.sessions);
      }
      if (Array.isArray(parsed.settings)) {
        await db.settings.bulkPut(parsed.settings);
      }
      setBackupMessage("Historial restaurado correctamente.");
    } catch {
      setBackupMessage("Error: El archivo JSON no tiene un formato válido.");
    }
  };

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* Cabecera Roadmap */}
      <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Roadmap 12 Semanas
          </span>
          <span className="text-xs bg-slate-700 px-2.5 py-1 rounded-full">
            Semana {currentWeek} de 12
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>{overallPercent}% del plan completado</span>
            <span>{totalSessionsCount} / 64 sesiones</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-slate-900/60 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400">
              Tiempo Colgado Acum.
            </div>
            <div className="text-lg font-bold text-white">
              {totalHangMinutes} min
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400">Sesiones Totales</div>
            <div className="text-lg font-bold text-emerald-400">
              {totalSessionsCount}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Ciclos Clínicos */}
      <div className="space-y-3">
        {phases.map((p, idx) => {
          const isCompleted = currentWeek > p.maxWeek;
          const isActive = currentWeek >= p.minWeek && currentWeek <= p.maxWeek;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                isActive
                  ? "bg-slate-800 border-emerald-500/60"
                  : isCompleted
                    ? "bg-slate-800/80 border-slate-700"
                    : "bg-slate-800/40 border-slate-800 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400">{p.phase}</span>
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completada
                  </span>
                ) : isActive ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Play className="w-3.5 h-3.5" /> En Progreso
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Lock className="w-3.5 h-3.5" /> Próximamente
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> {p.title}
              </h3>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {p.goals.map((g, gi) => (
                  <li key={gi} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Privacidad y Respaldo Local */}
      <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Privacidad & Respaldo Local 100%
          en tu dispositivo
        </div>
        <p className="text-xs text-slate-400">
          Tus datos se guardan localmente en IndexedDB. Exporta un respaldo JSON
          para conservar tu historial.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleExportJSON}
            className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Exportar JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Restaurar JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
        {backupMessage && (
          <p className="text-xs text-emerald-400 font-medium">
            {backupMessage}
          </p>
        )}
      </div>
    </div>
  );
};
