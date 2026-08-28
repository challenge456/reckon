"use client";

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-8 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function GoalCardSkeleton() {
  return (
    <div className="card border-l-4 border-muted/30 bg-muted/5 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
          <div className="h-6 bg-muted rounded w-20"></div>
        </div>
        <div className="h-10 bg-muted rounded w-24"></div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-2/3"></div>
        <div className="h-8 bg-muted rounded w-1/2"></div>
        <div className="h-3 bg-muted rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-8 h-8 bg-muted rounded"></div>
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}