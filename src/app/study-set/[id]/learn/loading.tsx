import SkeletonButton from "antd/es/skeleton/Button";
import React from "react";

const loading = () => {
  return (
    <div>
      <SkeletonButton className="min-h-[30rem] w-full rounded-lg" active />
    </div>
  );
};

export default loading;
