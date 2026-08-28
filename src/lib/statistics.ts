import { prisma } from "@/lib/prisma";
import { getReliability } from "./stats";

/**
 * Get comprehensive statistics for a user
 */
export async function getUserStatistics(userId: string) {
  const [goals, consequences, streak, lifelines, reliability] = await Promise.all([
    prisma.goal.findMany({
      where: { userId },
      select: { status: true, createdAt: true, completedAt: true, deadline: true },
    }),
    prisma.consequenceAssignment.findMany({
      where: { userId },
      select: { status: true, assignedAt: true, completedAt: true },
    }),
    prisma.streak.findUnique({
      where: { userId },
      select: { current: true, longest: true },
    }),
    prisma.lifeline.findUnique({
      where: { userId },
      select: { remaining: true },
    }),
    getReliability(userId),
  ]);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const missedGoals = goals.filter((g) => g.status === "MISSED").length;

  const totalConsequences = consequences.length;
  const completedConsequences = consequences.filter((c) => c.status === "COMPLETED").length;
  const missedConsequences = consequences.filter((c) => c.status === "MISSED").length;

  // Goals by month for trend data
  const goalsThisMonth = goals.filter((g) => {
    const now = new Date();
    const goalDate = new Date(g.createdAt);
    return goalDate.getMonth() === now.getMonth() && goalDate.getFullYear() === now.getFullYear();
  }).length;

  const goalsLastMonth = goals.filter((g) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const goalDate = new Date(g.createdAt);
    return goalDate.getMonth() === lastMonth.getMonth() && goalDate.getFullYear() === lastMonth.getFullYear();
  }).length;

  // Average completion time (for completed goals)
  const completedWithTime = goals.filter((g) => g.completedAt && g.createdAt);
  const avgCompletionHours =
    completedWithTime.length > 0
      ? completedWithTime.reduce((sum, g) => {
          if (!g.completedAt) return sum;
          const hours = (g.completedAt.getTime() - g.createdAt.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / completedWithTime.length
      : 0;

  return {
    goals: {
      total: totalGoals,
      completed: completedGoals,
      missed: missedGoals,
      active: totalGoals - completedGoals - missedGoals,
      thisMonth: goalsThisMonth,
      lastMonth: goalsLastMonth,
      avgCompletionHours: Math.round(avgCompletionHours * 10) / 10,
    },
    consequences: {
      total: totalConsequences,
      completed: completedConsequences,
      missed: missedConsequences,
      pending: totalConsequences - completedConsequences - missedConsequences,
    },
    streak: {
      current: streak?.current ?? 0,
      longest: streak?.longest ?? 0,
    },
    reliability: reliability.percentage ?? 0,
    lifelinesRemaining: lifelines?.remaining ?? 7,
  };
}

/**
 * Get goal history for pagination/display
 */
export async function getGoalHistory(userId: string, limit = 50, offset = 0) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      consequenceAssignments: {
        include: { consequence: true },
        orderBy: { assignedAt: "desc" },
        take: 1,
      },
    },
  });

  const total = await prisma.goal.count({
    where: { userId },
  });

  return {
    goals,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Get goals by status breakdown
 */
export async function getGoalsByStatus(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    select: { status: true },
  });

  return {
    active: goals.filter((g) => g.status === "ACTIVE").length,
    completed: goals.filter((g) => g.status === "COMPLETED").length,
    missed: goals.filter((g) => g.status === "MISSED").length,
  };
}

/**
 * Get consequence stats by difficulty
 */
export async function getConsequencesByDifficulty(userId: string) {
  const consequences = await prisma.consequenceAssignment.findMany({
    where: { userId },
    include: { consequence: true },
  });

  const easy = consequences.filter((c) => c.consequence.difficulty === "EASY").length;
  const medium = consequences.filter((c) => c.consequence.difficulty === "MEDIUM").length;
  const hard = consequences.filter((c) => c.consequence.difficulty === "HARD").length;

  return {
    easy,
    medium,
    hard,
    total: consequences.length,
  };
}
