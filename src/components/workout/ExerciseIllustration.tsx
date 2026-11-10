import React from "react";

interface ExerciseIllustrationProps {
  exerciseId: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  exerciseId,
}) => {
  // Mapeo de IDs de ejercicios a sus respectivos videos locales
  const videoSrc = `/videos/${exerciseId}.mp4`;
  return (
    <div className="w-full aspect-video flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/40">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};
