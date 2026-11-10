import React, { useState, useEffect, useRef } from "react";
import { type ExerciseStep } from "../data/routinePlan";
import { db } from "../db/database";
import { playTibetanGong } from "../utils/tibetanGong";
import { WorkPhaseView } from "./WorkPhaseView";
import { RestPhaseView } from "./RestPhaseView";
import { FeedbackPhaseView, type FeelingType } from "./FeedbackPhaseView";

interface ActiveWorkoutViewProps {
  exercises: ExerciseStep[];
  onClose: () => void;
  onFinished: () => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  exercises,
  onClose,
  onFinished,
}) => {
  const [exIndex, setExIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest" | "feedback">("work");
  const [secondsLeft, setSecondsLeft] = useState<number>(
    exercises[0]?.durationSec ?? 25,
  );
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const [hangSeconds, setHangSeconds] = useState(0);

  const currentEx = exercises[exIndex];
  const isLastStep =
    exIndex === exercises.length - 1 && setNumber === currentEx.sets;

  const advanceToNext = () => {
    if (setNumber < currentEx.sets) {
      setSetNumber((s) => s + 1);
      setPhase("work");
      setSecondsLeft(currentEx.durationSec ?? 0);
      setIsPaused(false);
    } else if (exIndex < exercises.length - 1) {
      const nextEx = exercises[exIndex + 1];
      setExIndex((i) => i + 1);
      setSetNumber(1);
      setPhase("work");
      setSecondsLeft(nextEx.durationSec ?? 0);
      setIsPaused(false);
    } else {
      setPhase("feedback");
    }
  };

  const handleStepComplete = () => {
    if (phase === "work") {
      if (isLastStep) {
        setPhase("feedback");
      } else {
        setPhase("rest");
        setSecondsLeft(currentEx.restSec);
        setIsPaused(false);
      }
    } else if (phase === "rest") {
      advanceToNext();
    }
  };

  useEffect(() => {
    if (isPaused || phase === "feedback") return;
    if (phase === "work" && currentEx.mode === "reps") return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playTibetanGong();
          handleStepComplete();
          return 0;
        }
        if (phase === "work" && currentEx.id === "dead-hang") {
          setHangSeconds((h) => h + 1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, phase, exIndex, setNumber]);

  const handleSaveSession = async (data: {
    feeling: FeelingType;
    rating: number;
    notes: string;
  }) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const totalDuration = Math.max(
      60,
      Math.round((Date.now() - startTimeRef.current) / 1000),
    );

    await db.sessions.put({
      date: dateStr,
      status: "completed",
      completedAt: timeStr,
      durationSeconds: totalDuration,
      exercisesCompleted: exercises.length,
      totalExercises: exercises.length,
      feeling: data.feeling,
      rating: data.rating,
      notes: data.notes,
      hangSecondsAccumulated: hangSeconds,
    });

    onFinished();
  };

  if (phase === "feedback") {
    return <FeedbackPhaseView onSave={handleSaveSession} />;
  }

  if (phase === "rest") {
    const nextIsSame = setNumber < currentEx.sets;
    return (
      <RestPhaseView
        completedSet={setNumber}
        secondsLeft={secondsLeft}
        breathingTip={currentEx.breathingTip}
        nextExercise={nextIsSame ? currentEx : exercises[exIndex + 1]}
        nextSetNumber={nextIsSame ? setNumber + 1 : 1}
        onBack={onClose}
        onAddTenSeconds={() => setSecondsLeft((s) => s + 10)}
        onSkipRest={advanceToNext}
        totalRestSeconds={1200}
      />
    );
  }

  return (
    <WorkPhaseView
      exercise={currentEx}
      exIndex={exIndex}
      totalExercises={exercises.length}
      setNumber={setNumber}
      secondsLeft={secondsLeft}
      isPaused={isPaused}
      isLastStep={isLastStep}
      onBack={onClose}
      onTogglePause={() => setIsPaused((p) => !p)}
      onAdjustTime={(delta) => setSecondsLeft((s) => Math.max(1, s + delta))}
      onCompleteSet={() => {
        playTibetanGong();
        handleStepComplete();
      }}
    />
  );
};
