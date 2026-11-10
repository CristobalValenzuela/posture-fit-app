import React, { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

export type FeelingType = "relieved" | "mild_tension" | "shoulder_discomfort";

interface FeedbackPhaseViewProps {
  onSave: (data: {
    feeling: FeelingType;
    rating: number;
    notes: string;
  }) => void;
}

export const FeedbackPhaseView: React.FC<FeedbackPhaseViewProps> = ({
  onSave,
}) => {
  const [feeling, setFeeling] = useState<FeelingType>("relieved");
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");

  const options: Array<{ id: FeelingType; label: string; desc: string }> = [
    {
      id: "relieved",
      label: "Columna aliviada",
      desc: "Descompresión torácica óptima",
    },
    {
      id: "mild_tension",
      label: "Tensión leve",
      desc: "Rigidez muscular normal al estirar",
    },
    {
      id: "shoulder_discomfort",
      label: "Molestia en hombro",
      desc: "Reducir tiempo en barra mañana",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-5 max-w-md mx-auto flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" /> ¡Rutina Nocturna Completada!
        </div>
        <h1 className="text-2xl font-bold">¿Cómo sientes tu columna hoy?</h1>

        <div className="space-y-2.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFeeling(opt.id)}
              className={`w-full text-left p-4 rounded-2xl border transition ${
                feeling === opt.id
                  ? "bg-emerald-500/20 border-emerald-500 text-white"
                  : "bg-slate-800 border-slate-700/60 text-slate-300"
              }`}
            >
              <div className="font-semibold text-sm">{opt.label}</div>
              <div className="text-xs text-slate-400">{opt.desc}</div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Calidad de ejecución
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2.5 rounded-xl border ${
                  rating >= star
                    ? "bg-amber-500/20 border-amber-400 text-amber-400"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">
            Notas de descompresión (opcional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Buena apertura en barra, sin molestia..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        onClick={() => onSave({ feeling, rating, notes })}
        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition mt-6"
      >
        Guardar en Calendario
      </button>
    </div>
  );
};
