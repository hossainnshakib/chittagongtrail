"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: { name: string; href: string }[];
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="public-mobile-menu" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={menuRef}
        className="ct-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="ct-mobile-menu-head">
          <Link href="/" onClick={onClose}>
            <Image src="/images/chittagongtrail_logo.png" alt="Chittagong Trail" width={36} height={36} className="h-9 w-auto" />
          </Link>
          <button type="button" className="ct-mobile-menu-close" onClick={onClose} aria-label="Close menu">
            Close
          </button>
        </div>
        <nav className="ct-mobile-menu-nav">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} onClick={onClose} className="ct-mobile-menu-link">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ct-mobile-menu-foot">
          Chittagong Trail — places, stories, food, and landscapes across five districts.
        </div>
      </div>
    </div>
  );
}
