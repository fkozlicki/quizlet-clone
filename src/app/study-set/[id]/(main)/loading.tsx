import StudySetSkeleton from "@/components/shared/StudySetSkeleton";
import StudyModes from "@/components/study-set/StudyModes";
import { Skeleton } from "antd";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import SkeletonButton from "antd/es/skeleton/Button";

export default function loading() {
  return (
    <div className="m-auto max-w-3xl">
      <div className="mb-4">
        <SkeletonButton className="mb-1" />
        <Skeleton title={false} paragraph={{ rows: 1 }} />
      </div>
      <StudyModes />
      <div className="mb-4">
        <SkeletonButton className="min-h-[21rem] w-full sm:min-h-[25rem]" />
      </div>
      <div className="mb-4 flex gap-2">
        <SkeletonAvatar />
        <SkeletonButton />
      </div>
      <div className="mb-4 flex flex-col gap-3">
        <SkeletonButton className="h-14 w-full" />
        <SkeletonButton className="h-14 w-full" />
        <SkeletonButton className="h-14 w-full" />
        <SkeletonButton className="h-14 w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StudySetSkeleton />
        <StudySetSkeleton />
        <StudySetSkeleton />
        <StudySetSkeleton />
      </div>
    </div>
  );
}
