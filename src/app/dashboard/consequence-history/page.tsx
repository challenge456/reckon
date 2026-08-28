import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Zap, CheckCircle2, XCircle } from "lucide-react";

export default async function ConsequenceHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const consequences = await prisma.consequenceAssignment.findMany({
    where: { userId: session.user.id },
    include: { consequence: true, goal: true },
    orderBy: { assignedAt: "desc" },
    take: 100,
  });

  const completed = consequences.filter((c) => c.status === "COMPLETED");
  const missed = consequences.filter((c) => c.status === "MISSED");
  const pending = consequences.filter((c) => c.status === "PENDING");

  const completionRate =
    completed.length + missed.length > 0
      ? Math.round(
          (completed.length / (completed.length + missed.length)) * 100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Consequence History</h1>
          <p className="text-muted mt-1">Track your accountability challenges</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Completed</p>
          <p className="text-3xl font-bold mt-2 text-success">{completed.length}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Missed</p>
          <p className="text-3xl font-bold mt-2 text-error">{missed.length}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Pending</p>
          <p className="text-3xl font-bold mt-2 text-warning">{pending.length}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-muted uppercase">Completion Rate</p>
          <p className="text-3xl font-bold mt-2 text-info">{completionRate}%</p>
        </div>
      </div>

      {/* Pending Consequences */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Pending Consequences</h2>
            <p className="text-sm text-muted">Active challenges waiting to be completed</p>
          </div>
          <div className="space-y-2">
            {pending.map((c) => (
              <div key={c.id} className="card-sm border-l-4 border-warning/30 bg-warning/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{c.consequence.name}</p>
                    <p className="text-xs text-muted mt-1">
                      For: <span className="font-medium">{c.goal.title}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`badge text-xs ${
                        c.consequence.difficulty === "EASY"
                          ? "bg-success/20 text-success"
                          : c.consequence.difficulty === "MEDIUM"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                      }`}>
                        {c.consequence.difficulty}
                      </span>
                      {c.escalationLevel > 0 && (
                        <span className="badge text-xs bg-muted/20 text-muted">
                          Escalation {c.escalationLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted flex-shrink-0">
                    <p>Due: {c.deadline.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Consequences */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div>
              <h2 className="text-lg font-semibold">Completed Consequences</h2>
              <p className="text-sm text-muted">You faced these challenges and won</p>
            </div>
          </div>
          <div className="space-y-2">
            {completed.map((c) => (
              <div key={c.id} className="card-sm border-l-4 border-success/30 bg-success/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{c.consequence.name}</p>
                    <p className="text-xs text-muted mt-1">
                      For: <span className="font-medium">{c.goal.title}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`badge text-xs ${
                        c.consequence.difficulty === "EASY"
                          ? "bg-success/20 text-success"
                          : c.consequence.difficulty === "MEDIUM"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                      }`}>
                        {c.consequence.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted flex-shrink-0">
                    <p>Completed: {c.completedAt?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missed Consequences */}
      {missed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-error" />
            <div>
              <h2 className="text-lg font-semibold">Missed Consequences</h2>
              <p className="text-sm text-muted">These escalated to new challenges</p>
            </div>
          </div>
          <div className="space-y-2">
            {missed.map((c) => (
              <div key={c.id} className="card-sm border-l-4 border-error/30 bg-error/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{c.consequence.name}</p>
                    <p className="text-xs text-muted mt-1">
                      For: <span className="font-medium">{c.goal.title}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`badge text-xs ${
                        c.consequence.difficulty === "EASY"
                          ? "bg-success/20 text-success"
                          : c.consequence.difficulty === "MEDIUM"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                      }`}>
                        {c.consequence.difficulty}
                      </span>
                      {c.escalationLevel > 0 && (
                        <span className="badge text-xs bg-muted/20 text-muted">
                          Escalation {c.escalationLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted flex-shrink-0">
                    <p>Missed: {c.deadline.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {consequences.length === 0 && (
        <div className="card-lg text-center py-12">
          <Zap className="w-16 h-16 mx-auto text-muted/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No consequences yet</h3>
          <p className="text-muted">
            Miss a goal deadline to get assigned consequences and build your accountability.
          </p>
        </div>
      )}
    </div>
  );
}