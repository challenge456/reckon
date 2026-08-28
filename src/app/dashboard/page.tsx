import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveAllDeadlines } from "@/lib/deadline-engine";
import { getReliability } from "@/lib/stats";
import { getRemainingLifelines } from "@/lib/lifelines";
import { Flame, TrendingUp, Target, LifeBuoy, ArrowRight } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  await resolveAllDeadlines(session.user.id);

  const [streak, reliability, activeGoalCount, lifelines, recentGoals, completedToday] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: session.user.id } }),
    getReliability(session.user.id),
    prisma.goal.count({
      where: { userId: session.user.id, status: "ACTIVE" },
    }),
    getRemainingLifelines(session.user.id),
    prisma.goal.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      orderBy: { deadline: "asc" },
      take: 3,
    }),
    prisma.goal.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        completedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {session.user.name}
            </h1>
            <p className="text-muted mt-1">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commitment Score */}
        <div className="card animate-fade-in-up stagger-1 hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Commitment Score
              </p>
              <p className="text-3xl font-bold mt-2">
                {reliability.percentage === null ? "—" : `${reliability.percentage}%`}
              </p>
              <p className="text-xs text-muted mt-2">
                {reliability.completed} completed, {reliability.missed} missed
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/40" />
          </div>
        </div>

        {/* Current Streak */}
        <div className="card animate-fade-in-up stagger-2 hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Current Streak
              </p>
              <p className="text-3xl font-bold mt-2">{streak?.current ?? 0}</p>
              <p className="text-xs text-muted mt-2">
                Longest: {streak?.longest ?? 0}
              </p>
            </div>
            <Flame className="w-8 h-8 text-warning/40" />
          </div>
        </div>

        {/* Active Goals */}
        <div className="card animate-fade-in-up stagger-3 hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Active Goals
              </p>
              <p className="text-3xl font-bold mt-2">{activeGoalCount}</p>
              <p className="text-xs text-muted mt-2">
                {completedToday} completed today
              </p>
            </div>
            <Target className="w-8 h-8 text-accent/40" />
          </div>
        </div>

        {/* Lifelines */}
        <div className="card animate-fade-in-up stagger-4 hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Lifelines
              </p>
              <p className="text-3xl font-bold mt-2">{lifelines} / 7</p>
              <p className="text-xs text-muted mt-2">
                {lifelines > 0 ? "Use wisely" : "All used"}
              </p>
            </div>
            <LifeBuoy className="w-8 h-8 text-info/40" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/dashboard/goals" className="btn btn-primary">
          <Target className="w-4 h-4" />
          My Goals
        </Link>
        <Link href="/dashboard/challenges" className="btn btn-secondary">
          <Flame className="w-4 h-4" />
          Active Challenges
        </Link>
      </div>

      {/* Active Goals Preview */}
      {activeGoalCount > 0 && (
        <div className="card-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Next Up</h2>
            <Link
              href="/dashboard/goals"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentGoals.map((goal) => {
              const timeUntil = goal.deadline.getTime() - Date.now();
              const hoursRemaining = Math.floor(timeUntil / (1000 * 60 * 60));
              const minutesRemaining = Math.floor((timeUntil / (1000 * 60)) % 60);

              return (
                <div
                  key={goal.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition"
                >
                  <div className="flex-1">
                    <p className="font-medium">{goal.title}</p>
                    {goal.category && (
                      <span className="inline-block text-xs font-medium text-primary mt-1 bg-primary/10 px-2 py-0.5 rounded">
                        {goal.category}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {timeUntil > 0 ? (
                      <p className="text-xs font-medium text-muted">
                        {hoursRemaining}h {minutesRemaining}m
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-error">Expired</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeGoalCount === 0 && (
        <div className="card-lg text-center py-12">
          <Target className="w-12 h-12 mx-auto text-muted/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No active goals</h3>
          <p className="text-muted mb-6">
            Create your first goal to start building accountability.
          </p>
          <Link href="/dashboard/goals" className="btn btn-primary">
            Create a Goal
          </Link>
        </div>
      )}
    </div>
  );
}