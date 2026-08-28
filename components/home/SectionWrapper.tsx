"use client";

import { ReactNode } from "react";
import { SectionReveal } from "@/components/ui";

interface SectionWrapperProps {
  children: ReactNode;
}

export function SectionWrapper({ children }: SectionWrapperProps) {
  return <SectionReveal>{children}</SectionReveal>;
}
