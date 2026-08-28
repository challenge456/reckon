"use client";

import type { Goal, ConsequenceAssignment, Consequence } from "@prisma/client";
import { completeGoal } from "@/lib/actions/goals";
import { MAX_ESCALATIONS } from "@/lib/consequence-engine";
import { ConsequencePicker } from "./consequence-picker";
import { ConsequenceStatus } from "./consequence-status";
import { CheckCircle2, Trash2, Edit2 } from "lucide-react";

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

const STATUS_STYLES: Record<string, { border: string; bg: string; badge: string }> = {
  ACTIVE: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    badge: "bg-primary/20 text-primary",
  },
  COMPLETED: {
    border: "border-success/30",
    bg: "bg-success/5",
    badge: "bg-success/20 text-success",
  },
  MISSED: {
    border: "border-error/30",
    bg: "bg-error/5",
    badge: "bg-error/20 text-error",
  },
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  MISSED: "Missed",
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
  const latest = goal.consequenceAssignments[0];
  const atCap = latest ? latest.escalationLevel >= MAX_ESCALATIONS : false;

  const showPicker =
    goal.status === "MISSED" &&
    (!latest || (latest.status === "MISSED" && !atCap));

  const showStatus = goal.status === "MISSED" && latest && !showPicker;

  const styles = STATUS_STYLES[goal.status];

  return (
    <div className={`card border-l-4 ${styles.border} ${styles.bg} animate-fade-in-up hover-lift press-effect`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{goal.title}</h3>
            <span className={`badge text-xs ${styles.badge}`}>
              {STATUS_LABEL[goal.status]}
            </span>
          </div>

          {goal.description && (
            <p className="text-sm text-muted mb-2">{goal.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-2">
            {goal.category && (
              <span className="inline-block rounded-full bg-muted/50 px-2.5 py-1">
                {goal.category}
              </span>
            )}
            <span className="font-medium">
              {goal.deadline.toLocaleDateString()} at {goal.deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {goal.status === "ACTIVE" && (
              <span className="font-medium text-primary">
                ⏱ {formatRemaining(goal.deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {goal.status === "ACTIVE" && (
            <form action={completeGoal} className="contents">
              <input type="hidden" name="goalId" value={goal.id} />
              <button
                type="submit"
                className="btn btn-sm btn-primary transition-smooth"
                title="Mark this goal as complete"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Consequence Picker */}
      {showPicker && eligibleOptions && (
        <div className="mt-4 pt-4 border-t border-border">
          {latest?.status === "MISSED" && (
            <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
              <p className="font-medium text-warning">You missed your last consequence.</p>
              <p className="text-xs text-warning/80 mt-1">Choose another one to keep making progress.</p>
            </div>
          )}
          <ConsequencePicker
            goalId={goal.id}
            options={eligibleOptions}
            weeklyLimits={weeklyLimits}
          />
        </div>
      )}

      {/* Consequence Status */}
      {showStatus && (
        <div className="mt-4 pt-4 border-t border-border">
          <ConsequenceStatus
            assignment={latest}
            atEscalationCap={atCap}
            remainingLifelines={remainingLifelines}
          />
        </div>
      )}
    </div>
  );
}