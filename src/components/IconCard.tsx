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
  return (
    <Link
      href={link}
      className="rounded-md border-b-4 border-white bg-white px-3 py-2 shadow-sm hover:border-cyan-200"
    >
      <div className="flex items-center gap-3">
        <Image src={icon} alt="" width={32} height={32} />
        <span className="text-base font-medium">{text}</span>
      </div>
    </Link>
  );
};

export default IconCard;
