"use client";

import type { Goal, ConsequenceAssignment, Consequence } from "@prisma/client";
import { completeGoal } from "@/lib/actions/goals";
import { MAX_ESCALATIONS } from "@/lib/consequence-engine";
import { ConsequencePicker } from "./consequence-picker";
import { ConsequenceStatus } from "./consequence-status";

type GoalWithAssignments = Goal & {
  consequenceAssignments: (ConsequenceAssignment & { consequence: Consequence })[];
};

function formatRemaining(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return "Deadline passed";
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}d ${hours}h remaining`;
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${totalHours}h ${minutes}m remaining`;
}

const STATUS_BORDER: Record<string, string> = {
  ACTIVE: "border-neutral-800",
  COMPLETED: "border-green-900",
  MISSED: "border-red-900",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "🟢 Active",
  COMPLETED: "✅ Completed",
  MISSED: "🔴 Missed",
};

export function GoalCard({
  goal,
  eligibleOptions,
  weeklyLimits,
  remainingLifelines,
}: {
  goal: GoalWithAssignments;
  eligibleOptions?: Consequence[];
  weeklyLimits?: { easyRemaining: number; mediumRemaining: number };
  remainingLifelines?: number;
}) {
  // consequenceAssignments is ordered newest-first (see the page query).
  const latest = goal.consequenceAssignments[0];
  const atCap = latest ? latest.escalationLevel >= MAX_ESCALATIONS : false;

  const showPicker =
    goal.status === "MISSED" &&
    (!latest || (latest.status === "MISSED" && !atCap));

  const showStatus = goal.status === "MISSED" && latest && !showPicker;

  return (
    <div
      className={`rounded-lg border bg-neutral-900 p-4 ${STATUS_BORDER[goal.status]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{goal.title}</p>
          {goal.category && (
            <span className="mt-1 inline-block rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {goal.category}
            </span>
          )}
        </div>
        <span className="whitespace-nowrap text-xs text-neutral-400">
          {STATUS_LABEL[goal.status]}
        </span>
      </div>

      {goal.description && (
        <p className="mt-2 text-sm text-neutral-400">{goal.description}</p>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        Deadline: {goal.deadline.toLocaleString()}
        {goal.status === "ACTIVE" && (
          <> · ⏱ {formatRemaining(goal.deadline)}</>
        )}
      </p>

      {goal.status === "ACTIVE" && (
        <form action={completeGoal} className="mt-3">
          <input type="hidden" name="goalId" value={goal.id} />
          <button
            type="submit"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-neutral-200"
          >
            ✅ Mark Complete
          </button>
        </form>
      )}

      {showPicker && eligibleOptions && (
        <>
          {latest?.status === "MISSED" && (
            <p className="mt-4 text-xs text-amber-500">
              You missed your last consequence — here&apos;s another one.
            </p>
          )}
          <ConsequencePicker
            goalId={goal.id}
            options={eligibleOptions}
            weeklyLimits={weeklyLimits}
          />
        </>
      )}

      {showStatus && <ConsequenceStatus assignment={latest} atEscalationCap={atCap} remainingLifelines={remainingLifelines} />}
    </div>
  );
}