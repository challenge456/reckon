import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateGoalForm } from "@/components/goals/create-goal-form";
import { GoalCard } from "@/components/goals/goal-card";
import { resolveAllDeadlines } from "@/lib/deadline-engine";
import { escalateExpiredConsequences } from "@/lib/actions/escalation";
import { getEligibleConsequences, MAX_ESCALATIONS } from "@/lib/consequence-engine";
import { getRemainingLifelines } from "@/lib/lifelines";
import { Target, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default async function GoalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  await resolveAllDeadlines(session.user.id);
  await escalateExpiredConsequences(session.user.id);

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
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");
  const missedGoals = goals.filter((g) => g.status === "MISSED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Goals</h1>
            <p className="text-muted mt-1">
              {activeGoals.length} active • {completedGoals.length} completed • {missedGoals.length} missed
            </p>
          </div>
        </div>
        <CreateGoalForm />
      </div>

      {/* Lifelines Indicator */}
      {remainingLifelines > 0 && (
        <div className="card p-4 bg-info/5 border-info/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Lifelines Available</p>
            <p className="text-xs text-muted mt-0.5">Use a lifeline to shield from consequences</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-info">{remainingLifelines}</p>
            <p className="text-xs text-info/70">of 7</p>
          </div>
        </div>
      )}

      {/* Active Goals Section */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Active Goals</h2>
              <p className="text-sm text-muted">Goals you're currently working on</p>
            </div>
          </div>
          <div className="space-y-3">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div>
              <h2 className="text-lg font-semibold">Completed Goals</h2>
              <p className="text-sm text-muted">You did it! Keep the streak going.</p>
            </div>
          </div>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Missed Goals Section with Consequences */}
      {missedGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-error" />
            <div>
              <h2 className="text-lg font-semibold">Missed Goals</h2>
              <p className="text-sm text-muted">Consequences assigned — face them to get back on track.</p>
            </div>
          </div>
          <div className="space-y-3">
            {missedGoals.map((goal) => {
              const latest = goal.consequenceAssignments[0];
              const atCap = latest ? latest.escalationLevel >= MAX_ESCALATIONS : false;

              const showPicker =
                goal.status === "MISSED" &&
                (!latest || (latest.status === "MISSED" && !atCap));

              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  eligibleOptions={showPicker ? eligible?.options : undefined}
                  weeklyLimits={eligible?.weeklyLimits}
                  remainingLifelines={remainingLifelines}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="card-lg text-center py-12">
          <Target className="w-16 h-16 mx-auto text-muted/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-muted mb-6 max-w-sm mx-auto">
            Create your first goal and set a deadline. If you miss it, you'll face a profession-relevant consequence.
          </p>
          <CreateGoalForm />
        </div>
      )}
    </div>
  );
}