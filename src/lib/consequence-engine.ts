import { prisma } from "@/lib/prisma";
import { startOfWeek } from "date-fns";
import type { Difficulty, WeeklyLimitUsage } from "@prisma/client";
import { Prisma } from "@prisma/client";

const EASY_WEEKLY_LIMIT = 2;
const MEDIUM_WEEKLY_LIMIT = 2;

export const MAX_ESCALATIONS = 2; // original + 2 escalations = 3 attempts max


function getCurrentWeekStart() {
  return startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
}

export async function getOrCreateWeeklyUsage(
  userId: string
): Promise<WeeklyLimitUsage> {
  const weekStart = getCurrentWeekStart();

  const existing = await prisma.weeklyLimitUsage.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });
  if (existing) return existing;

  try {
    return await prisma.weeklyLimitUsage.create({
      data: { userId, weekStart, easyUsed: 0, mediumUsed: 0 },
    });
  } catch (err) {
    // Race condition: another concurrent call created the row first.
    // Re-fetch instead of failing.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const row = await prisma.weeklyLimitUsage.findUnique({
        where: { userId_weekStart: { userId, weekStart } },
      });
      if (row) return row;
    }
    throw err;
  }
}

function computeAllowedDifficulties(usage: WeeklyLimitUsage): Difficulty[] {
  const allowed: Difficulty[] = ["HARD"]; // Hard is always available
  if (usage.easyUsed < EASY_WEEKLY_LIMIT) allowed.push("EASY");
  if (usage.mediumUsed < MEDIUM_WEEKLY_LIMIT) allowed.push("MEDIUM");
  return allowed;
}

export async function getAllowedDifficulties(
  userId: string
): Promise<Difficulty[]> {
  const usage = await getOrCreateWeeklyUsage(userId);
  return computeAllowedDifficulties(usage);
}

export async function getEligibleConsequences(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Fetch usage exactly once, then derive everything else from it —
  // this avoids the race condition of two concurrent create() calls.
  const usage = await getOrCreateWeeklyUsage(userId);
  const allowedDifficulties = computeAllowedDifficulties(usage);

  const pool = await prisma.consequence.findMany({
    where: {
      profession: user.profession,
      difficulty: { in: allowedDifficulties },
    },
  });

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 4);

  return {
    options,
    weeklyLimits: {
      easyRemaining: Math.max(0, EASY_WEEKLY_LIMIT - usage.easyUsed),
      mediumRemaining: Math.max(0, MEDIUM_WEEKLY_LIMIT - usage.mediumUsed),
    },
  };
}