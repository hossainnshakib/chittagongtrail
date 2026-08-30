"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMobileOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        closeMobile();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <div className="admin-shell">
      <a
        href="#admin-main-content"
        className="admin-sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--admin-sidebar-bg)] focus:text-[var(--admin-sidebar-active-text)] focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
        style={{ outline: "2px solid var(--admin-focus-ring)", outlineOffset: "2px" }}
      >
        Skip to main content
      </a>

      <AdminSidebar isOpen={mobileOpen} onClose={closeMobile} />

      <div className="admin-main">
        <AdminTopbar onMenuToggle={() => setMobileOpen((prev) => !prev)} />
        <main id="admin-main-content" className="admin-content" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
