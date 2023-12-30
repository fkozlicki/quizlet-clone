import { Typography, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { UrlObject } from "url";

interface IconCardProps {
  icon: string;
  text: string;
  link: string | UrlObject;
}

const IconCard = ({ icon, text, link }: IconCardProps) => {
  const {
    token: { colorBorder, colorBgContainer },
  } = theme.useToken();

  return (
    <Link
      href={link}
      className={`rounded-md border-b-4 px-3 py-2 shadow-sm hover:!border-cyan-300/50`}
      style={{
        background: colorBgContainer,
        borderColor: colorBorder,
      }}
    >
      <div className="flex items-center gap-3">
        <Image src={icon} alt="" width={32} height={32} />
        <Typography.Text className="font-semibold">{text}</Typography.Text>
      </div>
    </Link>
  );
};

export default IconCard;
