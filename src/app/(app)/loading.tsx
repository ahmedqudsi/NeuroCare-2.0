
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <Skeleton className="h-12 w-1/2 rounded-lg" />
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full rounded-lg" />
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
