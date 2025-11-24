import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Skeleton className="h-6 w-64 mb-8" />
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-96 mb-6" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
