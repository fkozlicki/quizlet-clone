import SkeletonButton from "antd/es/skeleton/Button";
import React from "react";

const loading = () => {
  return (
    <div>
      <SkeletonButton className="min-h-[40rem] w-full" active />
    </div>
  );
};

export default loading;
