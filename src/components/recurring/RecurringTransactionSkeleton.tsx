import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecurringTransactionSkeleton() {
  return (
    <Card className="shadow-card border-border/30 rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex gap-2 pt-3 border-t border-border/50">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
