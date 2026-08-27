import { prisma } from "@/lib/prisma";
import { isSameDay, isYesterday } from "date-fns";

export async function updateStreakOnCompletion(userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  const now = new Date();

  if (!streak) {
    await prisma.streak.create({
      data: { userId, current: 1, longest: 1, lastCompletedAt: now },
    });
    return;
  }

  let newCurrent: number;

  if (streak.lastCompletedAt && isSameDay(streak.lastCompletedAt, now)) {
    // Already completed something today — streak doesn't move again.
    newCurrent = streak.current;
  } else if (streak.lastCompletedAt && isYesterday(streak.lastCompletedAt)) {
    // Consecutive day — extend the streak.
    newCurrent = streak.current + 1;
  } else {
    // Gap of more than one day (or first-ever completion after a long time).
    newCurrent = 1;
  }

  await prisma.streak.update({
    where: { userId },
    data: {
      current: newCurrent,
      longest: Math.max(newCurrent, streak.longest),
      lastCompletedAt: now,
    },
  });
}