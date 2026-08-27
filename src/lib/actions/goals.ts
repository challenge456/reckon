"use server";

import { updateStreakOnCompletion } from "@/lib/streak";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createGoalSchema } from "@/lib/validations/goal";
import { revalidatePath } from "next/cache";

export async function completeGoal(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    console.error("No session");
    return;
  }

  const goalId = formData.get("goalId");
  if (typeof goalId !== "string" || !goalId) {
    console.error("Missing goal id");
    return;
  }

  // Ownership check: fetch the goal and verify it actually belongs to
  // this session's user before touching it — never trust the client.
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal || goal.userId !== session.user.id) {
    console.error("Goal not found or unauthorized");
    return;
  }

  if (goal.status !== "ACTIVE") {
    console.error("Goal not active");
    return;
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await updateStreakOnCompletion(session.user.id);

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
}

export async function createGoal(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    console.error("No session for goal creation");
    return;
  }

  const parsed = createGoalSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    console.error("Invalid goal data", parsed.error);
    return;
  }

  await prisma.goal.create({
    data: {
      // userId always comes from the server-verified session, never from
      // the client — this is the ownership rule applied to every mutation.
      userId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      deadline: new Date(parsed.data.deadline),
    },
  });

  revalidatePath("/dashboard/goals");
}