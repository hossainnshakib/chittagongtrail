"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useGsap";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: SectionRevealProps) {
  const ref = useScrollReveal({ delay });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
