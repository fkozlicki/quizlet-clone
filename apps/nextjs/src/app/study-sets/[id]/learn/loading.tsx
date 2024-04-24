import { Skeleton } from "@acme/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-auto max-w-3xl">
      <Skeleton className="mb-4 h-2 w-full rounded-full" />
      <Skeleton className="h-[334px] w-full" />
    </div>
  );
}
