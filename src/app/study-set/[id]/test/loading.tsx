import SkeletonButton from "antd/es/skeleton/Button";
import React from "react";

const loading = () => {
  return (
    <div className="m-auto max-w-3xl">
      <div className="flex flex-col gap-4">
        <SkeletonButton className="min-h-[32rem] w-full" active />
        <SkeletonButton className="min-h-[32rem] w-full" active />
        <SkeletonButton className="min-h-[32rem] w-full" active />
        <SkeletonButton className="min-h-[32rem] w-full" active />
      </div>
    </div>
  );
};

export default loading;
