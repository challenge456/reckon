import { prisma } from "@/lib/prisma";

/**
 * Flips any ACTIVE goal whose deadline has passed to MISSED.
 */
export async function resolveExpiredGoals(userId?: string) {
  return prisma.goal.updateMany({
    where: {
      status: "ACTIVE",
      deadline: { lt: new Date() },
      ...(userId ? { userId } : {}),
    },
    data: { status: "MISSED" },
  });
}

/**
 * Flips any PENDING consequence assignment whose deadline has passed to
 * MISSED. Escalation (assigning a new consequence) happens on-demand when
 * the user next views the goal, via the consequence picker — not here.
 */
export async function resolveExpiredConsequences(userId?: string) {
  return prisma.consequenceAssignment.updateMany({
    where: {
      status: "PENDING",
      deadline: { lt: new Date() },
      ...(userId ? { userId } : {}),
    },
    data: { status: "MISSED" },
  });
}

export async function resolveAllDeadlines(userId?: string) {
  const [goals, consequences] = await Promise.all([
    resolveExpiredGoals(userId),
    resolveExpiredConsequences(userId),
  ]);
  return { goalsMarkedMissed: goals.count, consequencesMarkedMissed: consequences.count };
}