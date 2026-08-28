import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserAchievements, ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements";
import { Trophy, Lock, Star } from "lucide-react";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const unlockedAchievements = await getUserAchievements(session.user.id);
  const unlockedKeys = new Set(unlockedAchievements.map((a) => a.achievement.criteriaKey));

  const unlocked = ACHIEVEMENT_DEFINITIONS.filter((def) => unlockedKeys.has(def.key));
  const locked = ACHIEVEMENT_DEFINITIONS.filter((def) => !unlockedKeys.has(def.key));

  const completionRate = Math.round((unlocked.length / ACHIEVEMENT_DEFINITIONS.length) * 100);

  const getAchievementIcon = (key: string) => {
    const iconMap: Record<string, string> = {
      FIRST_COMMITMENT: "🎯",
      FIRST_COMPLETION: "✅",
      STREAK_7: "🔥",
      STREAK_30: "⚡",
      CHALLENGE_ACCEPTED: "💪",
      COMEBACK: "🏆",
      RELIABLE: "📈",
      NO_ESCAPE: "🛟",
      LIFELINE_SAVER: "⛑️",
      TOTAL_GOALS_10: "📊",
    };
    return iconMap[key] || "⭐";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted mt-1">Celebrate your accountability milestones</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted uppercase tracking-wide mb-2">
              Completion
            </p>
            <p className="text-4xl font-bold">
              {unlocked.length} <span className="text-muted text-2xl">/ {ACHIEVEMENT_DEFINITIONS.length}</span>
            </p>
          </div>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(completionRate / 100) * 251.2} 251.2`}
                className="text-primary transition-all"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy="0.3em"
                className="text-lg font-bold fill-primary"
              >
                {completionRate}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Unlocked</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((achievement) => {
              const unlockedInfo = unlockedAchievements.find(
                (a) => a.achievement.criteriaKey === achievement.key
              );
              return (
                <div
                  key={achievement.key}
                  className="card border-l-4 border-success/30 bg-success/5"
                >
                  <div className="flex gap-4">
                    <div className="text-4xl flex-shrink-0">
                      {getAchievementIcon(achievement.key)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted mt-1">{achievement.description}</p>
                      {unlockedInfo && (
                        <p className="text-xs text-muted mt-2">
                          Unlocked {unlockedInfo.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted" />
            <h2 className="text-lg font-semibold">Locked</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((achievement) => (
              <div
                key={achievement.key}
                className="card opacity-60 border-l-4 border-muted/30 bg-muted/5"
              >
                <div className="flex gap-4">
                  <div className="text-4xl flex-shrink-0 opacity-30">
                    {getAchievementIcon(achievement.key)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted mt-1">{achievement.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
