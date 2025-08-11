// components/StepProgressBar.tsx
"use client";
import { useStupes } from "@/stores/useStupes";

export default function StepProgressBar() {
  const { step, totalSteps } = useStupes();

  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 h-2">
      <div
        className="h-2 bg-orange-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
