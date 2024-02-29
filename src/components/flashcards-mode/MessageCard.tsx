"use client";

import { theme } from "antd";
import { type AnimationScope } from "framer-motion";
import React from "react";

interface MessageCardProps {
  know: boolean;
  animationScope: AnimationScope<HTMLDivElement>;
}

const MessageCard = ({ know, animationScope }: MessageCardProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      ref={animationScope}
      className={`invisible absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-lg opacity-0 shadow`}
      style={{
        background: colorBgContainer,
      }}
    >
      <div
        className={`text-3xl font-bold ${know ? "text-green-400" : "text-orange-600"}`}
      >
        {know ? "Know" : "Still learning"}
      </div>
    </div>
  );
};

export default MessageCard;
