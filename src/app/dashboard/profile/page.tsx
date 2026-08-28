import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getReliability } from "@/lib/stats";
import { getRemainingLifelines } from "@/lib/lifelines";
import { getAchievementStats } from "@/lib/achievements";
import { User, Mail, Briefcase, Calendar, TrendingUp } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, profession: true, createdAt: true },
  });

  const [reliability, lifelines, achievements, streak, goalCount] = await Promise.all([
    getReliability(session.user.id),
    getRemainingLifelines(session.user.id),
    getAchievementStats(session.user.id),
    prisma.streak.findUnique({ where: { userId: session.user.id } }),
    prisma.goal.count({ where: { userId: session.user.id } }),
  ]);

  if (!user) {
    redirect("/signin");
  }

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted mt-1">Your RECKON identity and stats</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card-lg">
        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-muted uppercase">Name</p>
              <p className="text-lg font-semibold mt-1">{user.name || "Not set"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-muted flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-muted uppercase">Email</p>
              <p className="text-lg font-semibold mt-1">{user.email}</p>
            </div>
          </div>

          {/* Profession */}
          <div className="flex items-start gap-4">
            <Briefcase className="w-5 h-5 text-muted flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-muted uppercase">Profession</p>
              <p className="text-lg font-semibold mt-1 capitalize">
                {user.profession.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 text-muted flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-muted uppercase">Member Since</p>
              <p className="text-lg font-semibold mt-1">{joinedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <p className="text-xs font-medium text-muted uppercase">Goals Created</p>
            <p className="text-3xl font-bold mt-2">{goalCount}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium text-muted uppercase">Reliability</p>
            <p className="text-3xl font-bold mt-2 text-primary">
              {reliability.percentage ?? "—"}%
            </p>
          </div>
          <div className="card">
            <p className="text-xs font-medium text-muted uppercase">Current Streak</p>
            <p className="text-3xl font-bold mt-2 text-warning">{streak?.current ?? 0}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium text-muted uppercase">Lifelines</p>
            <p className="text-3xl font-bold mt-2 text-info">{lifelines}</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium text-muted uppercase">Achievements</p>
            <p className="text-3xl font-bold mt-2">{achievements.unlocked}</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h3 className="font-semibold mb-4">Account</h3>
        <div className="space-y-3">
          <p className="text-sm text-muted mb-4">
            Manage your account settings and preferences
          </p>
          <a href="/dashboard/settings" className="btn btn-secondary w-full">
            Go to Settings
          </a>
        </div>
      </div>
    </div>
  );
}