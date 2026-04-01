"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface StepProgressProps {
  totalSteps?: number;
}

const stepMap: Record<string, number> = {
  "/loginstep": 1,
  "/loginstep/step2": 2,
  "/loginstep/step3": 3,
  "/loginstep/step4": 3,
  "/loginstep/step9": 3,
  "/loginstep/step10": 4,
};

const StepProgress = ({ totalSteps = 4 }: StepProgressProps) => {
  const pathname = usePathname();
  const currentStep = stepMap[pathname] ?? 1;

  return (
    <div className="flex items-center w-full max-w-xs mx-auto mt-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 transition-all duration-300 ${
                isCompleted || isActive
                  ? "bg-[#8D1B3D]"
                  : "bg-[#E8E0D8]"
              }`}
            />
            {stepNum < totalSteps && (
              <div className="flex-1 h-[3px] mx-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-[#8D1B3D]" : "bg-[#E8E0D8]"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
