import { Skeleton } from "@/components/ui/skeleton"

export default function HelperLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
