"use client";

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  trend?: { direction: "up" | "down"; percent: number };
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="mt-1 text-xs text-neutral-500">{subtext}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={
              trend.direction === "up" ? "text-green-500" : "text-red-500"
            }
          >
            {trend.direction === "up" ? "↑" : "↓"}
          </span>
          <span className="text-xs text-neutral-400">
            {trend.percent}% this month
          </span>
        </div>
      )}
    </div>
  );
}

export function ProgressBar({
  label,
  value,
  max,
  color = "blue",
}: {
  label: string;
  value: number;
  max: number;
  color?: "blue" | "green" | "amber" | "red";
}) {
  const percent = Math.round((value / max) * 100);

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-300">{label}</p>
        <p className="text-sm text-neutral-400">
          {value}/{max}
        </p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all ${colorClasses[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function GoalHistoryItem({
  title,
  status,
  createdAt,
  deadline,
  consequence,
}: {
  title: string;
  status: "ACTIVE" | "COMPLETED" | "MISSED";
  createdAt: Date;
  deadline: Date;
  consequence?: {
    name: string;
    status: "PENDING" | "COMPLETED" | "MISSED";
  };
}) {
  const statusEmoji = {
    ACTIVE: "🟢",
    COMPLETED: "✅",
    MISSED: "🔴",
  };

  const consequenceEmoji = {
    PENDING: "🔒",
    COMPLETED: "✅",
    MISSED: "❌",
  };

  return (
    <div className="flex items-start justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span>{statusEmoji[status]}</span>
          <p className="font-medium text-white">{title}</p>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Created: {createdAt.toLocaleDateString()} · Deadline:{" "}
          {deadline.toLocaleDateString()}
        </p>
        {consequence && (
          <div className="mt-2 text-xs">
            <span>{consequenceEmoji[consequence.status]}</span>
            <span className="ml-1 text-neutral-400">{consequence.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
