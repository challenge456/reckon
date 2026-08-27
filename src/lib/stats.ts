import { prisma } from "@/lib/prisma";

/**
 * Reliability formula: completed goals / (completed + missed goals) * 100.
 * Active goals don't count toward this yet — only resolved outcomes do.
 * Returns null percentage if the user has no resolved goals yet.
 */
export async function getReliability(userId: string) {
  const [completed, missed] = await Promise.all([
    prisma.goal.count({ where: { userId, status: "COMPLETED" } }),
    prisma.goal.count({ where: { userId, status: "MISSED" } }),
  ]);

  const total = completed + missed;
  const percentage = total === 0 ? null : Math.round((completed / total) * 100);

  return { completed, missed, total, percentage };
}