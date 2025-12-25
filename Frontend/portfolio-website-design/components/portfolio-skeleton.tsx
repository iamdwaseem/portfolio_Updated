import { Skeleton } from "@/components/ui/skeleton"

export function PortfolioSkeleton() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero Skeleton */}
      <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
        <Skeleton className="h-32 w-full max-w-3xl" />
      </div>

      {/* Projects Skeleton */}
      <div className="container mx-auto px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="container mx-auto px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
