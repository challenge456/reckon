import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { History } from "lucide-react";

export default async function GoalHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id, status: { in: ["COMPLETED", "MISSED"] } },
    orderBy: { completedAt: "desc" },
    take: 100,
  });

  const completed = goals.filter((g) => g.status === "COMPLETED");
  const missed = goals.filter((g) => g.status === "MISSED");

  const completionRate =
    goals.length > 0
      ? Math.round((completed.length / (completed.length + missed.length)) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <History className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Goal History</h1>
          <p className="text-muted mt-1">Review your past goals and performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Total Resolved</p>
          <p className="text-3xl font-bold mt-2">{goals.length}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Completion Rate</p>
          <p className="text-3xl font-bold mt-2 text-success">{completionRate}%</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Completed vs Missed</p>
          <p className="text-lg font-bold mt-2">
            <span className="text-success">{completed.length}</span>
            <span className="text-muted mx-2">/</span>
            <span className="text-error">{missed.length}</span>
          </p>
        </div>
      </div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">All Goals</h2>
            <p className="text-sm text-muted">Sorted by most recent</p>
          </div>
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`card-sm flex items-start justify-between border-l-4 ${
                  goal.status === "COMPLETED"
                    ? "border-success/30 bg-success/5"
                    : "border-error/30 bg-error/5"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{goal.title}</p>
                    <span
                      className={`badge text-xs ${
                        goal.status === "COMPLETED"
                          ? "bg-success/20 text-success"
                          : "bg-error/20 text-error"
                      }`}
                    >
                      {goal.status === "COMPLETED" ? "Completed" : "Missed"}
                    </span>
                  </div>
                  {goal.category && (
                    <p className="text-xs text-muted mb-1">{goal.category}</p>
                  )}
                  <p className="text-xs text-muted">
                    Deadline: {goal.deadline.toLocaleDateString()}
                  </p>
                </div>
                {goal.completedAt && (
                  <div className="text-right text-xs text-muted flex-shrink-0 ml-4">
                    <p className="font-medium">
                      {goal.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-lg text-center py-12">
          <History className="w-16 h-16 mx-auto text-muted/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No history yet</h3>
          <p className="text-muted">
            Create and complete goals to build your history.
          </p>
        </div>
      )}
    </div>
  );
}