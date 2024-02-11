import SkeletonButton from "antd/es/skeleton/Button";
import Title from "antd/es/typography/Title";
import React from "react";

const loading = () => {
  return (
    <>
      <Title className="mb-4 text-xl font-bold">Recent activity</Title>
      <div className="grid h-[400px] w-full place-items-center rounded-2xl bg-white">
        <SkeletonButton className="m-auto h-80 w-full max-w-96" active />
      </div>
    </>
  );
};

export default loading;
