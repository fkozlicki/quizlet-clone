import SkeletonInput from "antd/es/skeleton/Input";

const FolderSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded bg-white px-6 py-2 shadow-md">
      <SkeletonInput className="h-4 " />
      <SkeletonInput className="h-6 " />
    </div>
  );
};

export default FolderSkeleton;
