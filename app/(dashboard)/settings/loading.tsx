export default function Loading() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  );
}
