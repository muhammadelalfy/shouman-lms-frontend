"use client";
// Adapted from Magic UI Shimmer Button, MIT. See THIRD-PARTY-NOTICES.md.
import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "./class-names";

// Upstream spark/container/highlight/backdrop structure shared by button and link.
function ShimmerDecoration({ children }: { children: ReactNode }) {
  return <>
    <span aria-hidden="true" className="shimmer-spark-container">
      <span className="shimmer-slide"><span className="shimmer-spin" /></span>
    </span>
    <span className="shimmer-label">{children}</span>
    <span aria-hidden="true" className="shimmer-highlight" />
    <span aria-hidden="true" className="shimmer-backdrop" />
  </>;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  function ShimmerButton({ children, className, type = "button", onClick, ...props }, ref) {
    return <button {...props} ref={ref} type={type} onClick={onClick} data-component="21st-shimmer-button" className={cn("shimmer-action", className)}><ShimmerDecoration>{children}</ShimmerDecoration></button>;
  },
);

export function ShimmerLink({ children, className, ...props }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...props} data-component="21st-shimmer-button" className={cn("shimmer-action", className)}><ShimmerDecoration>{children}</ShimmerDecoration></Link>;
}
