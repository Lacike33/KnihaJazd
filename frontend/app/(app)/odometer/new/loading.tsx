export default function NewOdometerReadingLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-muted rounded w-1/3" />
        <div className="h-64 bg-muted rounded" />
        <div className="h-96 bg-muted rounded" />
      </div>
    </div>
  )
}
