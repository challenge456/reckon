"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getAllowedDifficulties,
  getOrCreateWeeklyUsage,
  MAX_ESCALATIONS,
} from "@/lib/consequence-engine";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { revalidatePath } from "next/cache";

/**
 * Check for expired consequences and escalate them if applicable.
 * Called on goal page load, via cron job, or manually.
 *
 * If a userId is provided, it is used for server-side/background jobs.
 * Otherwise, the authenticated user's ID is used.
 */
export async function escalateExpiredConsequences(userId?: string) {
  const session = await auth();

  // We need either an explicit server-side user ID or an authenticated user.
  if (!userId && !session?.user?.id) {
    console.error("No session for escalation");
    return { escalated: 0, failed: 0 };
  }

  // TypeScript now knows session.user.id exists in the fallback case.
  const targetUserId = userId ?? session?.user?.id;

  if (!targetUserId) {
    console.error("Unable to determine target user for escalation");
    return { escalated: 0, failed: 0 };
  }

  // Find all PENDING consequences whose deadline has passed
  const expiredConsequences = await prisma.consequenceAssignment.findMany({
    where: {
      userId: targetUserId,
      status: "PENDING",
      deadline: { lt: new Date() },
    },
    include: { goal: true },
  });

  let escalated = 0;
  let failed = 0;

  for (const consequence of expiredConsequences) {
    try {
      // Mark this consequence as MISSED
      await prisma.consequenceAssignment.update({
        where: { id: consequence.id },
        data: { status: "MISSED" },
      });

      // Check if we can escalate
      const existingAssignments =
        await prisma.consequenceAssignment.findMany({
          where: { goalId: consequence.goalId },
          orderBy: { assignedAt: "desc" },
        });

      const latestAssignment = existingAssignments[0];
      const currentEscalationLevel =
        latestAssignment?.escalationLevel ?? 0;

      // Only escalate if under cap
      if (currentEscalationLevel < MAX_ESCALATIONS) {
        // Get user
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
        });

        if (!user) {
          failed++;
          continue;
        }

        const allowedDifficulties =
          await getAllowedDifficulties(targetUserId);

        // Get available consequences
        const escalationPool = await prisma.consequence.findMany({
          where: {
            profession: user.profession,
            difficulty: { in: allowedDifficulties },
          },
        });

        if (escalationPool.length === 0) {
          // This shouldn't happen if HARD consequences are always available.
          failed++;
          continue;
        }

        // Pick a random consequence
        const escalatedConsequence =
          escalationPool[
            Math.floor(Math.random() * escalationPool.length)
          ];

        // Create a new deadline 24 hours from now
        const newDeadline = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        );

        await prisma.$transaction(async (tx) => {
          await tx.consequenceAssignment.create({
            data: {
              userId: targetUserId,
              goalId: consequence.goalId,
              consequenceId: escalatedConsequence.id,
              deadline: newDeadline,
              escalationLevel: currentEscalationLevel + 1,
            },
          });

          // Update weekly usage if applicable
          if (
            escalatedConsequence.difficulty === "EASY" ||
            escalatedConsequence.difficulty === "MEDIUM"
          ) {
            const usage = await getOrCreateWeeklyUsage(targetUserId);

            await tx.weeklyLimitUsage.update({
              where: { id: usage.id },
              data: {
                easyUsed:
                  escalatedConsequence.difficulty === "EASY"
                    ? usage.easyUsed + 1
                    : usage.easyUsed,

                mediumUsed:
                  escalatedConsequence.difficulty === "MEDIUM"
                    ? usage.mediumUsed + 1
                    : usage.mediumUsed,
              },
            });
          }
        });

        escalated++;
      } else {
        // At escalation cap — mark as final consequence missed
        failed++;
      }
    } catch (err) {
      console.error("Error escalating consequence:", err);
      failed++;
    }
  }

  if (escalated > 0) {
    await checkAndUnlockAchievements(targetUserId);

    revalidatePath("/dashboard/goals");
    revalidatePath("/dashboard/challenges");
  }

  return { escalated, failed };
}

/**
 * Manually mark a consequence as completed.
 */
export async function completeConsequenceManual(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    console.error("No session for consequence completion");
    return;
  }

  const userId = session.user.id;

  const assignmentId = formData.get("assignmentId");

  if (typeof assignmentId !== "string") {
    console.error("Missing assignment id");
    return;
  }

  const assignment = await prisma.consequenceAssignment.findUnique({
    where: { id: assignmentId },
  });

  // Ownership check
  if (!assignment || assignment.userId !== userId) {
    console.error("Consequence not found or unauthorized");
    return;
  }

  if (assignment.status !== "PENDING") {
    console.error("Consequence is no longer pending");
    return;
  }

  await prisma.consequenceAssignment.update({
    where: { id: assignmentId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  await checkAndUnlockAchievements(userId);

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/challenges");
}