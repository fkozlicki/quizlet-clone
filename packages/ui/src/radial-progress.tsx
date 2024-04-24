"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from ".";

const RadialProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    strokeWidth?: number;
    size?: number;
  }
>(({ className, value, strokeWidth = 8, size = 64, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-grid place-content-center overflow-hidden rounded-full align-middle",
      className,
    )}
    style={{
      width: `${size}px`,
      height: `${size}px`,
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`absolute bottom-0 left-0 right-0 top-0 rounded-full content-['']`}
      style={{
        background: `radial-gradient(farthest-side,hsla(var(--primary)) 98%,#0000) top/${strokeWidth}px ${strokeWidth}px no-repeat,conic-gradient(hsla(var(--primary)) calc(${value}*1%),#0000 0)`,
        mask: `radial-gradient(farthest-side, #0000 calc(99% - ${strokeWidth}px), #000 calc(100% - ${strokeWidth}px))`,
      }}
    />
    <div
      className="absolute rounded-full bg-primary content-['']"
      style={{
        inset: `calc(50% - ${strokeWidth}px/2)`,
        transform: `rotate(calc(${value} * 3.6deg - 90deg)) translate(calc(${size}px / 2 - 50%))`,
      }}
    ></div>
    <span className="text-sm">{value}%</span>
  </ProgressPrimitive.Root>
));
RadialProgress.displayName = ProgressPrimitive.Root.displayName;

export { RadialProgress };
