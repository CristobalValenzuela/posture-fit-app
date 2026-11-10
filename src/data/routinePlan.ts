export interface ExerciseStep {
  id: string;
  name: string;
  subtitle: string;
  muscleTag: string;
  sets: number;
  mode: "timer" | "reps";
  durationSec?: number;
  repsLabel?: string;
  restSec: number;
  breathingTip: string;
  cues: string[];
}

export function getNightlyExercises(weekNumber: number): ExerciseStep[] {
  const isPhase2 = weekNumber >= 3 && weekNumber <= 4;
  const isPhase3Plus = weekNumber >= 5;

  return [
    {
      id: "dead-hang",
      name: "Colgado Pasivo en Barra",
      subtitle: "Descompresión lumbosacra activa",
      muscleTag: "Dorsales & Hombros",
      sets: 3,
      mode: "timer",
      durationSec: isPhase3Plus ? 40 : isPhase2 ? 30 : 25,
      restSec: 30,
      breathingTip:
        "Inhala en 4s... exhala en 4s... suelta tensión en cuello y trapecios.",
      cues: [
        "Hombros relajados: Déjalos ascender hacia las orejas de forma pasiva.",
        "Respiración diafragmática: Inhala en 4s, exhala en 6s sintiendo apertura lumbar.",
        "Agarre firme prono: Manos al ancho de los hombros, sin balancearse.",
      ],
    },
    {
      id: "pec-stretch",
      name: "Estiramiento Pectoral en Marco",
      subtitle: "Corrección de hombros adelantados",
      muscleTag: "Pectoral Mayor & Menor",
      sets: 3,
      mode: "timer",
      durationSec: isPhase2 || isPhase3Plus ? 45 : 35,
      restSec: 30,
      breathingTip:
        "Relaja el pecho al exhalar y evita arquear la zona lumbar.",
      cues: [
        "Codo a 90° apoyado contra el marco de la puerta.",
        "Adelanta suavemente el tronco sin rotación brusca.",
        "Mantén el cuello alineado mirando al frente.",
      ],
    },
    {
      id: "scapular-pulls",
      name: "Retracciones Escapulares en Barra",
      subtitle: "Fuerza para trapecio inferior",
      muscleTag: "Trapecio Inferior & Romboides",
      sets: 3,
      mode: "reps",
      repsLabel: isPhase3Plus
        ? "12 reps"
        : isPhase2
          ? "10-12 reps"
          : "8-10 reps",
      restSec: 35,
      breathingTip: "Exhala al subir el pecho, inhala lento al bajar.",
      cues: [
        "Céntrate en juntar las escápulas sin flexionar los codos.",
        "Baja los hombros lejos de las orejas y sostén 2s arriba.",
        "Mantén el abdomen activo y cuello neutro.",
      ],
    },
    {
      id: "wall-angels",
      name: "Ángel en Pared (Wall Angels)",
      subtitle: "Movilidad torácica contra cifosis",
      muscleTag: "Extensores Torácicos",
      sets: 3,
      mode: "reps",
      repsLabel: isPhase2 || isPhase3Plus ? "12 reps" : "10 reps",
      restSec: 30,
      breathingTip: "Desliza los brazos al ritmo de una exhalación lenta.",
      cues: [
        "Talones, glúteos, espalda alta y cabeza pegados a la pared.",
        "Evita que la zona lumbar se despegue al subir los brazos.",
        "Forma una W al bajar y una Y al subir sin encoger trapecios.",
      ],
    },
    {
      id: "glute-bridge",
      name: "Puente de Glúteos con Pausa",
      subtitle: "Alivio del psoas e inhibición flexora",
      muscleTag: "Cadena Posterior & Core",
      sets: 3,
      mode: "reps",
      repsLabel: isPhase3Plus ? "15 reps (2s pausa)" : "12 reps (2s pausa)",
      restSec: 30,
      breathingTip:
        "Presiona los codos contra el suelo mientras exhalas arriba.",
      cues: [
        "Empuja el suelo con los talones y codos para abrir el pecho.",
        "Sostén 2 segundos arriba contrayendo glúteos sin hiperextender.",
        "Desciende vértebra por vértebra.",
      ],
    },
  ];
}
