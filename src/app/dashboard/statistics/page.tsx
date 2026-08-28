import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getReliability } from "@/lib/stats";
import { BarChart3, TrendingUp, Zap } from "lucide-react";

export default async function StatisticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const [reliability, streak, goals, consequences, completedToday] = await Promise.all([
    getReliability(session.user.id),
    prisma.streak.findUnique({ where: { userId: session.user.id } }),
    prisma.goal.findMany({
      where: { userId: session.user.id },
      select: { status: true, createdAt: true },
    }),
    prisma.consequenceAssignment.findMany({
      where: { userId: session.user.id },
      select: { status: true },
    }),
    prisma.goal.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  const activeGoals = goals.filter((g) => g.status === "ACTIVE").length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const missedGoals = goals.filter((g) => g.status === "MISSED").length;
  const completedConsequences = consequences.filter((c) => c.status === "COMPLETED").length;
  const missedConsequences = consequences.filter((c) => c.status === "MISSED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-muted mt-1">Your accountability metrics at a glance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Reliability</p>
          <p className="text-3xl font-bold mt-2 text-primary">
            {reliability.percentage ?? "—"}%
          </p>
          <p className="text-xs text-muted mt-2">
            {reliability.completed} completed, {reliability.missed} missed
          </p>
        </div>

        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Current Streak</p>
          <p className="text-3xl font-bold mt-2 text-warning">
            {streak?.current ?? 0}
          </p>
          <p className="text-xs text-muted mt-2">
            Longest: {streak?.longest ?? 0}
          </p>
        </div>

        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Total Goals</p>
          <p className="text-3xl font-bold mt-2">{goals.length}</p>
          <p className="text-xs text-muted mt-2">
            {completedToday} completed today
          </p>
        </div>

        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Consequences</p>
          <p className="text-3xl font-bold mt-2">{consequences.length}</p>
          <p className="text-xs text-muted mt-2">
            {completedConsequences} completed
          </p>
        </div>
      </div>

      {/* Goal Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Goal Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Completed</p>
              <span className="text-2xl font-bold text-success">{completedGoals}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{
                  width: `${goals.length > 0 ? (completedGoals / goals.length) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {goals.length > 0
                ? Math.round((completedGoals / goals.length) * 100)
                : 0}%
              of all goals
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Missed</p>
              <span className="text-2xl font-bold text-error">{missedGoals}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-error h-2 rounded-full transition-all"
                style={{
                  width: `${goals.length > 0 ? (missedGoals / goals.length) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {goals.length > 0 ? Math.round((missedGoals / goals.length) * 100) : 0}% of
              all goals
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Active</p>
              <span className="text-2xl font-bold text-primary">{activeGoals}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${goals.length > 0 ? (activeGoals / goals.length) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {goals.length > 0 ? Math.round((activeGoals / goals.length) * 100) : 0}% of
              all goals
            </p>
          </div>
        </div>
      </div>

      {/* Consequence Stats */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Consequence Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Completed</p>
              <span className="text-2xl font-bold text-success">
                {completedConsequences}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{
                  width: `${
                    consequences.length > 0
                      ? (completedConsequences / consequences.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              You faced these challenges and won
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium">Missed</p>
              <span className="text-2xl font-bold text-error">{missedConsequences}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-error h-2 rounded-full transition-all"
                style={{
                  width: `${
                    consequences.length > 0
                      ? (missedConsequences / consequences.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              These escalated to new challenges
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="card-lg text-center py-12">
          <TrendingUp className="w-16 h-16 mx-auto text-muted/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No data yet</h3>
          <p className="text-muted">
            Create and complete goals to start building your statistics.
          </p>
        </div>
      )}
    </div>
  );
}
