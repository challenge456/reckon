import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserStatistics, getGoalHistory } from "@/lib/statistics";
import { StatCard, ProgressBar, GoalHistoryItem } from "@/components/statistics/stat-cards";

export default async function StatisticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const [stats, history] = await Promise.all([
    getUserStatistics(session.user.id),
    getGoalHistory(session.user.id, 20),
  ]);

  const trendPercent =
    stats.goals.lastMonth > 0
      ? Math.round(((stats.goals.thisMonth - stats.goals.lastMonth) / stats.goals.lastMonth) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-semibold">📊 Statistics</h1>
        <p className="mb-8 text-neutral-400">
          Track your progress and accountability metrics.
        </p>

        {/* Overview Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Goals"
            value={stats.goals.total}
            icon="🎯"
            trend={
              trendPercent !== 0
                ? {
                    direction: trendPercent > 0 ? "up" : "down",
                    percent: Math.abs(trendPercent),
                  }
                : undefined
            }
          />
          <StatCard
            label="Reliability"
            value={`${stats.reliability}%`}
            subtext={`${stats.goals.completed} completed`}
            icon="📈"
          />
          <StatCard
            label="Current Streak"
            value={stats.streak.current}
            subtext={`Longest: ${stats.streak.longest} days`}
            icon="🔥"
          />
          <StatCard
            label="Lifelines"
            value={stats.lifelinesRemaining}
            subtext="7 total"
            icon="🛟"
          />
        </div>

        {/* Progress Bars */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <ProgressBar
            label="Goals Completed"
            value={stats.goals.completed}
            max={stats.goals.total || 1}
            color="green"
          />
          <ProgressBar
            label="Goals Missed"
            value={stats.goals.missed}
            max={stats.goals.total || 1}
            color="red"
          />
          <ProgressBar
            label="Consequences Completed"
            value={stats.consequences.completed}
            max={stats.consequences.total || 1}
            color="blue"
          />
          <ProgressBar
            label="Active Goals"
            value={stats.goals.active}
            max={stats.goals.total || 1}
            color="amber"
          />
        </div>

        {/* Additional Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-400">This Month</p>
            <p className="mt-1 text-xl font-bold text-white">
              {stats.goals.thisMonth} goals
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-400">Last Month</p>
            <p className="mt-1 text-xl font-bold text-white">
              {stats.goals.lastMonth} goals
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-xs text-neutral-400">Avg Completion Time</p>
            <p className="mt-1 text-xl font-bold text-white">
              {stats.goals.avgCompletionHours > 0
                ? `${stats.goals.avgCompletionHours}h`
                : "—"}
            </p>
          </div>
        </div>

        {/* Goal History */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Goal History</h2>
            <p className="text-sm text-neutral-400">
              {history.total} total goal{history.total !== 1 ? "s" : ""}
            </p>
          </div>

          {history.goals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 p-10 text-center">
              <p className="mb-1 text-lg">📝 No goals yet</p>
              <p className="text-sm text-neutral-400">
                Create your first goal to start tracking progress.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.goals.map((goal) => (
                <GoalHistoryItem
                  key={goal.id}
                  title={goal.title}
                  status={goal.status}
                  createdAt={goal.createdAt}
                  deadline={goal.deadline}
                  consequence={
                    goal.consequenceAssignments[0]
                      ? {
                          name: goal.consequenceAssignments[0].consequence.name,
                          status: goal.consequenceAssignments[0].status,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
