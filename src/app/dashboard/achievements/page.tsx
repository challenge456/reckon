import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAchievements, getAchievementStats } from "@/lib/achievements";
import { AchievementGrid, AchievementShowcase } from "@/components/achievements/badge";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const [achievements, stats] = await Promise.all([
    getUserAchievements(session.user.id),
    getAchievementStats(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-semibold">🏆 Achievements</h1>
        <p className="mb-8 text-neutral-400">
          Unlock badges by completing goals and overcoming challenges.
        </p>

        <div className="mb-8">
          <AchievementShowcase
            unlocked={stats.unlocked}
            total={stats.total}
            percentage={stats.percentage}
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Unlocked Badges</h2>
          <AchievementGrid achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
