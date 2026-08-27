import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveAllDeadlines } from "@/lib/deadline-engine";
import { getReliability } from "@/lib/stats";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  await resolveAllDeadlines(session.user.id);

  const [streak, reliability, activeGoalCount] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: session.user.id } }),
    getReliability(session.user.id),
    prisma.goal.count({
      where: { userId: session.user.id, status: "ACTIVE" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-xl font-semibold">
        Welcome, {session.user.name} 👋
      </h1>
      <p className="mt-1 text-sm text-neutral-400">{session.user.email}</p>

      <div className="mt-6 grid max-w-2xl grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Streak</p>
          <p className="mt-1 text-2xl font-semibold">
            🔥 {streak?.current ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Reliability</p>
          <p className="mt-1 text-2xl font-semibold">
            {reliability.percentage === null ? "—" : `${reliability.percentage}%`}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">Active goals</p>
          <p className="mt-1 text-2xl font-semibold">{activeGoalCount}</p>
        </div>
      </div>

      <Link
        href="/dashboard/goals"
        className="mt-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
      >
        🎯 Go to My Goals
      </Link>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin" });
        }}
      >
        <button
          type="submit"
          className="mt-4 block rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}