"use client";

import type { ConsequenceAssignment, Consequence } from "@prisma/client";
import { completeConsequence } from "@/lib/actions/consequences";
import { useLifelineAction } from "@/lib/actions/lifelines";

export function ConsequenceStatus({
  assignment,
  atEscalationCap,
  remainingLifelines,
}: {
  assignment: ConsequenceAssignment & { consequence: Consequence };
  atEscalationCap?: boolean;
  remainingLifelines?: number;
}) {
  const { consequence } = assignment;

  const heading =
    assignment.status === "PENDING"
      ? "🔒 Consequence locked"
      : assignment.status === "COMPLETED"
        ? "✅ Consequence completed"
        : atEscalationCap
          ? "⚠️ Consequence missed — escalation limit reached"
          : "❌ Consequence missed";

  return (
    <div className="mt-4 border-t border-neutral-800 pt-4">
      <p className="mb-1 text-sm font-medium">{heading}</p>
      <p className="text-sm text-neutral-300">{consequence.name}</p>
      <p className="mt-1 text-xs text-neutral-400">{consequence.description}</p>

      {assignment.status === "PENDING" && (
        <>
          <p className="mt-2 text-xs text-neutral-500">
            Complete by: {assignment.deadline.toLocaleString()}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {consequence.externalUrl && (
              <a
                href={consequence.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-800"
              >
                Open Challenge ↗
              </a>
            )}

            <form action={completeConsequence} className="inline-block">
              <input type="hidden" name="assignmentId" value={assignment.id} />
              <button
                type="submit"
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-neutral-200"
              >
                Mark Complete
              </button>
            </form>

            {remainingLifelines !== undefined && remainingLifelines > 0 && (
              <form action={useLifelineAction} className="inline-block">
                <input
                  type="hidden"
                  name="consequenceAssignmentId"
                  value={assignment.id}
                />
                <button
                  type="submit"
                  className="rounded-lg border border-amber-600 bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-900"
                >
                  🛟 Use Lifeline ({remainingLifelines})
                </button>
              </form>
            )}
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            Completion is self-reported — external platforms can&apos;t be
            automatically verified.
          </p>
        </>
      )}

      {assignment.status === "MISSED" && atEscalationCap && (
        <p className="mt-2 text-xs text-neutral-500">
          You&apos;ve reached the maximum number of consequence escalations
          for this goal. No further action is required here, but it still
          counts against your reliability score.
        </p>
      )}
    </div>
  );
}