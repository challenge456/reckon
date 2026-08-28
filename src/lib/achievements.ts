import { prisma } from "@/lib/prisma";

/**
 * Achievement definitions - the criteria and metadata
 */
export const ACHIEVEMENT_DEFINITIONS = [
  {
    key: "FIRST_COMMITMENT",
    name: "First Commitment",
    description: "Create your first goal",
    emoji: "🎯",
  },
  {
    key: "FIRST_COMPLETION",
    name: "Goal Getter",
    description: "Complete your first goal",
    emoji: "✅",
  },
  {
    key: "STREAK_7",
    name: "On Fire",
    description: "Complete 7 goals in a row",
    emoji: "🔥",
  },
  {
    key: "STREAK_30",
    name: "Unstoppable",
    description: "Complete 30 goals in a row",
    emoji: "⚡",
  },
  {
    key: "CHALLENGE_ACCEPTED",
    name: "Challenge Accepted",
    description: "Complete your first consequence",
    emoji: "💪",
  },
  {
    key: "COMEBACK",
    name: "Comeback King",
    description: "Complete a consequence after missing a goal",
    emoji: "🏆",
  },
  {
    key: "RELIABLE",
    name: "Reliable",
    description: "Maintain 80%+ reliability",
    emoji: "📈",
  },
  {
    key: "NO_ESCAPE",
    name: "No Escape",
    description: "Complete 5 consequences without using lifelines",
    emoji: "🛟",
  },
  {
    key: "LIFELINE_SAVER",
    name: "Lifeline Saver",
    description: "Use a lifeline for the first time",
    emoji: "⛑️",
  },
  {
    key: "TOTAL_GOALS_10",
    name: "Goal Tracker",
    description: "Create 10 goals",
    emoji: "📊",
  },
];

/**
 * Seed achievements into database
 */
export async function seedAchievements() {
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({
      where: { criteriaKey: def.key },
      update: {
        name: def.name,
        description: def.description,
      },
      create: {
        name: def.name,
        description: def.description,
        criteriaKey: def.key,
      },
    });
  }
}

/**
 * Check and unlock achievements for a user
 */
export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      goals: true,
      achievements: { include: { achievement: true } },
      streak: true,
      lifelines: true,
    },
  });

  if (!user) return;

  const unlockedKeys = new Set(
    user.achievements.map((a) => a.achievement.criteriaKey)
  );

  const toUnlock: string[] = [];

  // FIRST_COMMITMENT: Has any goal
  if (!unlockedKeys.has("FIRST_COMMITMENT") && user.goals.length > 0) {
    toUnlock.push("FIRST_COMMITMENT");
  }

  // FIRST_COMPLETION: Has any completed goal
  if (!unlockedKeys.has("FIRST_COMPLETION")) {
    const completed = user.goals.filter((g) => g.status === "COMPLETED");
    if (completed.length > 0) {
      toUnlock.push("FIRST_COMPLETION");
    }
  }

  // TOTAL_GOALS_10: Created 10+ goals
  if (!unlockedKeys.has("TOTAL_GOALS_10") && user.goals.length >= 10) {
    toUnlock.push("TOTAL_GOALS_10");
  }

  // STREAK_7: Current streak >= 7
  if (!unlockedKeys.has("STREAK_7") && user.streak && user.streak.current >= 7) {
    toUnlock.push("STREAK_7");
  }

  // STREAK_30: Current streak >= 30
  if (!unlockedKeys.has("STREAK_30") && user.streak && user.streak.current >= 30) {
    toUnlock.push("STREAK_30");
  }

  // CHALLENGE_ACCEPTED: Has any completed consequence
  if (!unlockedKeys.has("CHALLENGE_ACCEPTED")) {
    const completedConsequences =
      await prisma.consequenceAssignment.findFirst({
        where: {
          userId,
          status: "COMPLETED",
        },
      });
    if (completedConsequences) {
      toUnlock.push("CHALLENGE_ACCEPTED");
    }
  }

  // COMEBACK: Completed a consequence after missing a goal
  if (!unlockedKeys.has("COMEBACK")) {
    const missedGoalsWithCompletedConsequence =
      await prisma.goal.findFirst({
        where: {
          userId,
          status: "MISSED",
          consequenceAssignments: {
            some: {
              status: "COMPLETED",
            },
          },
        },
      });
    if (missedGoalsWithCompletedConsequence) {
      toUnlock.push("COMEBACK");
    }
  }

  // RELIABLE: 80%+ reliability
  if (!unlockedKeys.has("RELIABLE")) {
    const totalGoals = user.goals.length;
    const completedGoals = user.goals.filter(
      (g) => g.status === "COMPLETED"
    ).length;
    if (totalGoals > 0) {
      const reliability = (completedGoals / totalGoals) * 100;
      if (reliability >= 80) {
        toUnlock.push("RELIABLE");
      }
    }
  }

  // LIFELINE_SAVER: Has used a lifeline
  if (!unlockedKeys.has("LIFELINE_SAVER")) {
    const lifelineUsage = await prisma.lifelineUsage.findFirst({
      where: { userId },
    });
    if (lifelineUsage) {
      toUnlock.push("LIFELINE_SAVER");
    }
  }

  // NO_ESCAPE: 5 completed consequences without lifelines
  if (!unlockedKeys.has("NO_ESCAPE")) {
    const completedConsequenceIds = await prisma.consequenceAssignment.findMany(
      {
        where: {
          userId,
          status: "COMPLETED",
        },
        select: { id: true },
      }
    );

    const usedOnThese = await prisma.lifelineUsage.findMany({
      where: {
        userId,
        context: {
          in: completedConsequenceIds.map((c) => c.id),
        },
      },
      select: { context: true },
    });

    const usedContexts = new Set(usedOnThese.map((u) => u.context));
    const nonLifelineConsequences = completedConsequenceIds.filter(
      (c) => !usedContexts.has(c.id)
    );

    if (nonLifelineConsequences.length >= 5) {
      toUnlock.push("NO_ESCAPE");
    }
  }

  // Unlock all new achievements
  if (toUnlock.length > 0) {
    for (const key of toUnlock) {
      const achievement = await prisma.achievement.findUnique({
        where: { criteriaKey: key },
      });

      if (achievement) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          update: {},
          create: {
            userId,
            achievementId: achievement.id,
          },
        });
      }
    }
  }

  return toUnlock;
}

/**
 * Get all achievements for a user
 */
export async function getUserAchievements(userId: string) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });

  return userAchievements;
}

/**
 * Get achievement stats for dashboard
 */
export async function getAchievementStats(userId: string) {
  const achievements = await getUserAchievements(userId);
  const total = ACHIEVEMENT_DEFINITIONS.length;
  const unlocked = achievements.length;

  return {
    unlocked,
    total,
    percentage: Math.round((unlocked / total) * 100),
    recent: achievements.slice(0, 3),
  };
}
