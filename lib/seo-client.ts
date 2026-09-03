"use client";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const isSiteUrlConfigured = Boolean(
  rawSiteUrl &&
    rawSiteUrl.startsWith("https://") &&
    !rawSiteUrl.includes("localhost") &&
    !rawSiteUrl.includes("127.0.0.1")
);

export const getSiteUrl = (path?: string): string => {
  if (!isSiteUrlConfigured) return "";
  const base = rawSiteUrl!.replace(/\/+$/, "");
  if (!path) return base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const getSiteOrigin = (): string => {
  if (!isSiteUrlConfigured) return "";
  try {
    return new URL(rawSiteUrl!).origin;
  } catch {
    return "";
  }
};

export const SITE_NAME = "Chittagong Trail";
export const SITE_DESCRIPTION =
  "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people through genuine discovery.";