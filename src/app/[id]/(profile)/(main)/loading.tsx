"use client";

import { theme } from "antd";
import SkeletonButton from "antd/es/skeleton/Button";
import Title from "antd/es/typography/Title";
import React from "react";

const loading = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Title className="mb-4 text-xl font-bold">Recent activity</Title>
      <div
        style={{ background: colorBgContainer }}
        className="rounded-2x grid h-[400px] w-full place-items-center"
      >
        <SkeletonButton className="m-auto h-80 w-full max-w-96" active />
      </div>
    </>
  );
};

export default loading;
