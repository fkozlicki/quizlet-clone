import Link from "next/link";
import React from "react";

interface IconButtonProps {
  as?: "div" | "link";
  Icon: (
    props: React.ComponentProps<"svg"> & { title?: string; titleId?: string }
  ) => JSX.Element;
  onClick?: () => void;
  onBlur?: () => void;
  href?: string;
  size: number;
}

const IconButton = ({
  Icon,
  onBlur,
  onClick,
  as,
  href,
  size,
}: IconButtonProps) => {
  const className =
    "rounded-full border border-slate-300 bg-white hover:bg-slate-200 w-[38px] h-[38px] flex items-center justify-center";

  if (as === "div")
    return (
      <div onClick={onClick} onBlur={onBlur} className={className}>
        <Icon width={size} height={size} className="text-slate-600" />
      </div>
    );

  if (as === "link" && href)
    return (
      <Link href={href} className={className}>
        <Icon width={size} height={size} className="text-slate-600" />
      </Link>
    );

  return (
    <button onClick={onClick} onBlur={onBlur} className={className}>
      <Icon width={size} height={size} className="text-slate-600" />
    </button>
  );
};

export default IconButton;
