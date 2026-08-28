import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getRemainingLifelines, getLifelineUsages } from "@/lib/lifelines";
import { LifeBuoy, Shield } from "lucide-react";

export default async function LifelinesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const [remaining, usages] = await Promise.all([
    getRemainingLifelines(session.user.id),
    getLifelineUsages(session.user.id),
  ]);

  const lifelinesUsed = 7 - remaining;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LifeBuoy className="w-8 h-8 text-info" />
        <div>
          <h1 className="text-3xl font-bold">Lifelines</h1>
          <p className="text-muted mt-1">You start with 7. Use them wisely.</p>
        </div>
      </div>

      {/* Lifeline Counter */}
      <div className="card-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted uppercase tracking-wide mb-2">
              Remaining Lifelines
            </p>
            <p className="text-5xl font-bold text-info">{remaining}</p>
            <p className="text-sm text-muted mt-2">
              Used {lifelinesUsed} of 7
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
                strokeDasharray={`${(remaining / 7) * 251.2} 251.2`}
                className="text-info transition-all"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy="0.3em"
                className="text-lg font-bold fill-info"
              >
                {Math.round((remaining / 7) * 100)}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* What is a Lifeline? */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">What is a Lifeline?</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Consequence Shield</p>
              <p className="text-sm text-muted">
                Skip one pending consequence without completing it. Use this when life happens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      {usages.length > 0 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Usage History</h2>
            <p className="text-sm text-muted">When you've used your lifelines</p>
          </div>
          <div className="space-y-2">
            {usages.map((usage) => (
              <div key={usage.id} className="card-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Lifeline Used</p>
                  <p className="text-xs text-muted">
                    {usage.usedAt.toLocaleDateString()} at{" "}
                    {usage.usedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <LifeBuoy className="w-5 h-5 text-info/50" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-8">
          <LifeBuoy className="w-12 h-12 mx-auto text-muted/20 mb-3" />
          <p className="text-muted">You haven't used any lifelines yet.</p>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-info/5 border-info/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span>💡</span> Use Lifelines Strategically
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          <li>• Save lifelines for when you're genuinely overwhelmed</li>
          <li>• Each lifeline can shield you from one consequence</li>
          <li>• Once used, you get a fresh count after 7 days</li>
          <li>• Don't waste them on easy consequences you could complete</li>
        </ul>
      </div>
    </div>
  );
}