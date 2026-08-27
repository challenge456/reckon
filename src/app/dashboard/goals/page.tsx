import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateGoalForm } from "@/components/goals/create-goal-form";
import { GoalCard } from "@/components/goals/goal-card";
import { resolveAllDeadlines } from "@/lib/deadline-engine";
import { getEligibleConsequences, MAX_ESCALATIONS } from "@/lib/consequence-engine";
import { getRemainingLifelines } from "@/lib/lifelines";

export default async function GoalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  await resolveAllDeadlines(session.user.id);

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { deadline: "asc" },
    include: {
      consequenceAssignments: {
        include: { consequence: true },
        orderBy: { assignedAt: "desc" },
      },
    },
  });

  const needsConsequence = goals.some((g) => {
    if (g.status !== "MISSED") return false;
    const latest = g.consequenceAssignments[0];
    if (!latest) return true;
    return latest.status === "MISSED" && latest.escalationLevel < MAX_ESCALATIONS;
  });

  const [eligible, remainingLifelines] = await Promise.all([
    needsConsequence ? getEligibleConsequences(session.user.id) : null,
    getRemainingLifelines(session.user.id),
  ]);

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const historyGoals = goals.filter((g) => g.status !== "ACTIVE");

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">🎯 My Goals</h1>
          {remainingLifelines > 0 && (
            <div className="text-sm text-amber-300">
              🛟 {remainingLifelines} lifeline{remainingLifelines !== 1 ? "s" : ""} remaining
            </div>
          )}
          <CreateGoalForm />
        </div>

        {goals.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-800 p-10 text-center">
            <p className="mb-1 text-lg">🎯 No commitments yet</p>
            <p className="text-sm text-neutral-400">
              Create your first goal and start building your streak.
            </p>
          </div>
        )}

        {activeGoals.length > 0 && (
          <div className="mb-8 space-y-3">
            <h2 className="text-sm font-medium text-neutral-400">Active</h2>
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}

        {historyGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-400">History</h2>
            {historyGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                eligibleOptions={eligible?.options}
                weeklyLimits={eligible?.weeklyLimits}
                remainingLifelines={remainingLifelines}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}