import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Zap, CheckCircle2, Clock } from "lucide-react";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const challenges = await prisma.consequenceAssignment.findMany({
    where: { userId: session.user.id, status: "PENDING" },
    include: { consequence: true, goal: true },
    orderBy: { deadline: "asc" },
  });

  const completedChallenges = await prisma.consequenceAssignment.findMany({
    where: { userId: session.user.id, status: "COMPLETED" },
    include: { consequence: true, goal: true },
    orderBy: { completedAt: "desc" },
    take: 5,
  });

  const formatTime = (date: Date) => {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Active Challenges</h1>
          <p className="text-muted mt-1">
            {challenges.length} active • {completedChallenges.length} completed
          </p>
        </div>
      </div>

      {/* Active Challenges */}
      {challenges.length > 0 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Pending Challenges</h2>
            <p className="text-sm text-muted">Complete these to get back on track</p>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="card border-l-4 border-warning/30 bg-warning/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{challenge.consequence.name}</h3>
                      <span className={`badge text-xs ${
                        challenge.consequence.difficulty === "EASY"
                          ? "bg-success/20 text-success"
                          : challenge.consequence.difficulty === "MEDIUM"
                          ? "bg-warning/20 text-warning"
                          : "bg-error/20 text-error"
                      }`}>
                        {challenge.consequence.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-2">{challenge.consequence.description}</p>
                    <p className="text-xs text-muted">
                      Due for: <span className="font-medium">{challenge.goal.title}</span>
                    </p>
                    {challenge.consequence.externalUrl && (
                      <a
                        href={challenge.consequence.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-medium text-primary hover:underline mt-2"
                      >
                        Open Challenge →
                      </a>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-warning">{formatTime(challenge.deadline)}</p>
                    <p className="text-xs text-muted mt-1">
                      {challenge.escalationLevel > 0 && `Escalation ${challenge.escalationLevel}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-lg text-center py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-success/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No active challenges</h3>
          <p className="text-muted">
            You're all caught up! Create goals and set deadlines to face new challenges.
          </p>
        </div>
      )}

      {/* Recently Completed */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Recently Completed</h2>
            <p className="text-sm text-muted">You faced these challenges and won</p>
          </div>
          <div className="space-y-2">
            {completedChallenges.map((challenge) => (
              <div key={challenge.id} className="card-sm border-l-4 border-success/30 bg-success/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{challenge.consequence.name}</p>
                    <p className="text-xs text-muted">{challenge.goal.title}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}