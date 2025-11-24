export default function DriverDetailLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
        <div className="h-96 bg-muted rounded" />
      </div>
    </div>
  )
}
