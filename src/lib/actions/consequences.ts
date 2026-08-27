"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getAllowedDifficulties,
  getOrCreateWeeklyUsage,
  MAX_ESCALATIONS,
} from "@/lib/consequence-engine";
import { revalidatePath } from "next/cache";

export async function assignConsequence(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("No session for consequence assignment");
    return;
  }

  const goalId = formData.get("goalId");
  const consequenceId = formData.get("consequenceId");
  if (typeof goalId !== "string" || typeof consequenceId !== "string") {
    console.error("Missing goal or consequence id");
    return;
  }

  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== session.user.id) {
    console.error("Goal not found or unauthorized");
    return;
  }
  if (goal.status !== "MISSED") {
    console.error("Goal is not missed");
    return;
  }

  // Look at the full assignment history for this goal to determine whether
  // this is a first assignment or an escalation, and enforce the cap.
  const existingAssignments = await prisma.consequenceAssignment.findMany({
    where: { goalId },
    orderBy: { assignedAt: "desc" },
  });
  const latest = existingAssignments[0];

  if (latest && latest.status !== "MISSED") {
    console.error("A consequence has already been assigned");
    return;
  }

  const nextEscalationLevel = latest ? latest.escalationLevel + 1 : 0;
  if (nextEscalationLevel > MAX_ESCALATIONS) {
    console.error("Escalation limit reached");
    return;
  }

  const consequence = await prisma.consequence.findUnique({
    where: { id: consequenceId },
  });
  if (!consequence) {
    console.error("Consequence not found");
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || consequence.profession !== user.profession) {
    console.error("Consequence not available to this profession");
    return;
  }

  const allowedDifficulties = await getAllowedDifficulties(session.user.id);
  if (!allowedDifficulties.includes(consequence.difficulty)) {
    console.error("Difficulty limit reached");
    return;
  }

  const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    await tx.consequenceAssignment.create({
      data: {
        userId,
        goalId,
        consequenceId,
        deadline,
        escalationLevel: nextEscalationLevel,
      },
    });

    if (consequence.difficulty === "EASY" || consequence.difficulty === "MEDIUM") {
      const usage = await getOrCreateWeeklyUsage(userId);
      await tx.weeklyLimitUsage.update({
        where: { id: usage.id },
        data: {
          easyUsed:
            consequence.difficulty === "EASY" ? usage.easyUsed + 1 : usage.easyUsed,
          mediumUsed:
            consequence.difficulty === "MEDIUM"
              ? usage.mediumUsed + 1
              : usage.mediumUsed,
        },
      });
    }
  });

  revalidatePath("/dashboard/goals");
}

export async function completeConsequence(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("No session for consequence completion");
    return;
  }

  const assignmentId = formData.get("assignmentId");
  if (typeof assignmentId !== "string") {
    console.error("Missing assignment id");
    return;
  }

  const assignment = await prisma.consequenceAssignment.findUnique({
    where: { id: assignmentId },
  });
  if (!assignment || assignment.userId !== session.user.id) {
    console.error("Consequence not found or unauthorized");
    return;
  }
  if (assignment.status !== "PENDING") {
    console.error("Consequence is no longer pending");
    return;
  }

  await prisma.consequenceAssignment.update({
    where: { id: assignmentId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  revalidatePath("/dashboard/goals");
}