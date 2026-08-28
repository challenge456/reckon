"use client";

import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements";

export function AchievementBadge({
  criteriaKey,
  unlockedAt,
}: {
  criteriaKey: string;
  unlockedAt: Date;
}) {
  const def = ACHIEVEMENT_DEFINITIONS.find((a) => a.key === criteriaKey);

  if (!def) return null;

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center transition hover:border-neutral-600">
      <div className="text-4xl">{def.emoji}</div>
      <div>
        <p className="text-sm font-medium text-white">{def.name}</p>
        <p className="text-xs text-neutral-400">{def.description}</p>
      </div>
      <p className="text-xs text-neutral-500">
        Unlocked {unlockedAt.toLocaleDateString()}
      </p>
    </div>
  );
}

export function AchievementGrid({
  achievements,
}: {
  achievements: Array<{
    achievement: {
      id: string;
      criteriaKey: string;
      name: string;
      description: string;
    };
    unlockedAt: Date;
  }>;
}) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-800 p-10 text-center">
        <p className="mb-1 text-lg">🏆 No achievements yet</p>
        <p className="text-sm text-neutral-400">
          Complete goals and consequences to unlock badges.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((ua) => (
        <AchievementBadge
          key={ua.achievement.id}
          criteriaKey={ua.achievement.criteriaKey}
          unlockedAt={ua.unlockedAt}
        />
      ))}
    </div>
  );
}

export function AchievementShowcase({
  unlocked,
  total,
  percentage,
}: {
  unlocked: number;
  total: number;
  percentage: number;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <p className="mb-2 text-sm font-medium text-neutral-300">
        🏆 Achievement Progress
      </p>
      <div className="flex items-end gap-4">
        <div>
          <p className="text-2xl font-bold text-white">{percentage}%</p>
          <p className="text-xs text-neutral-400">
            {unlocked}/{total} badges
          </p>
        </div>
        <div className="flex-1">
          <div className="h-2 rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
