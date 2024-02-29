"use client";

import { theme } from "antd";
import Text from "antd/es/typography/Text";
import Image from "next/image";
import Link from "next/link";

interface IconCardProps {
  icon: string;
  text: string;
  href: string;
}

const IconCard = ({ icon, text, href }: IconCardProps) => {
  const {
    token: { colorBorder, colorBgContainer },
  } = theme.useToken();

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md border-b-4 px-3 py-2 shadow-sm hover:!border-cyan-300/50"
      style={{
        background: colorBgContainer,
        borderColor: colorBorder,
      }}
    >
      <Image src={icon} alt="" width={32} height={32} />
      <Text className="font-semibold">{text}</Text>
    </Link>
  );
};

export default IconCard;
