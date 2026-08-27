"use client";

import type { Consequence } from "@prisma/client";
import { assignConsequence } from "@/lib/actions/consequences";

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "🟢 Easy",
  MEDIUM: "🟡 Medium",
  HARD: "🔴 Hard",
};

export function ConsequencePicker({
  goalId,
  options,
  weeklyLimits,
}: {
  goalId: string;
  options: Consequence[];
  weeklyLimits?: { easyRemaining: number; mediumRemaining: number };
}) {
  if (options.length === 0) {
    return (
      <p className="mt-3 text-sm text-neutral-500">
        No consequences available right now — check back soon.
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-neutral-800 pt-4">
      <p className="mb-1 text-sm font-medium">⚠️ Choose your consequence</p>
      {weeklyLimits && (
        <p className="mb-3 text-xs text-neutral-500">
          Easy remaining this week: {weeklyLimits.easyRemaining}/2 · Medium
          remaining: {weeklyLimits.mediumRemaining}/2
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <form key={option.id} action={assignConsequence}>
            <input type="hidden" name="goalId" value={goalId} />
            <input type="hidden" name="consequenceId" value={option.id} />
            <button
              type="submit"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-left text-sm transition hover:border-neutral-500"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.name}</span>
                <span className="text-xs text-neutral-400">
                  {DIFFICULTY_LABEL[option.difficulty]}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                {option.description}
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                ~{option.estimatedMinutes} min
                {option.externalPlatform && ` · via ${option.externalPlatform}`}
              </p>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}