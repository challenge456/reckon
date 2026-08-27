import { prisma } from "@/lib/prisma";

/**
 * Get or create lifelines for a user (7 by default on first call)
 */
export async function getOrCreateLifelines(userId: string) {
  let lifeline = await prisma.lifeline.findUnique({
    where: { userId },
  });

  if (!lifeline) {
    lifeline = await prisma.lifeline.create({
      data: {
        userId,
        remaining: 7,
      },
    });
  }

  return lifeline;
}

/**
 * Get remaining lifelines for a user
 */
export async function getRemainingLifelines(userId: string): Promise<number> {
  const lifeline = await getOrCreateLifelines(userId);
  return lifeline.remaining;
}

/**
 * Use one lifeline to skip a consequence
 * Returns true if successful, false if no lifelines remaining
 */
export async function useLifeline(
  userId: string,
  consequenceAssignmentId: string
): Promise<boolean> {
  const lifeline = await getOrCreateLifelines(userId);

  if (lifeline.remaining <= 0) {
    return false;
  }

  // Use a transaction to ensure consistency
  await prisma.$transaction(async (tx) => {
    // Deduct one lifeline
    await tx.lifeline.update({
      where: { userId },
      data: { remaining: { decrement: 1 } },
    });

    // Record the lifeline usage
    await tx.lifelineUsage.create({
      data: {
        userId,
        type: "shield",
        context: consequenceAssignmentId,
      },
    });

    // Mark the consequence as completed (skipped via lifeline)
    await tx.consequenceAssignment.update({
      where: { id: consequenceAssignmentId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  });

  return true;
}

/**
 * Get all lifeline usages for a user
 */
export async function getLifelineUsages(userId: string) {
  return prisma.lifelineUsage.findMany({
    where: { userId },
    orderBy: { usedAt: "desc" },
  });
}
