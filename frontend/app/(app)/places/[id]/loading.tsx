import { Skeleton } from "@/components/ui/skeleton"

export default function PlaceDetailLoading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-32" />
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
