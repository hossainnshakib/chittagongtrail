"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./MobileMenu";

const navigation = [
  { name: "Trails", href: "/trails" },
  { name: "Journal", href: "/journal" },
  { name: "Food", href: "/food" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="ct-nav" data-scrolled={isScrolled || undefined}>
        <Link href="/" className="ct-nav-brand">
          <Image
            src="/images/chittagongtrail_logo.png"
            alt="Chittagong Trail"
            width={36}
            height={36}
            className="ct-nav-logo"
            priority
          />
          <span className="ct-nav-brand-text">
            <b>Chittagong Trail</b>
            <small>Places, stories, food</small>
          </span>
        </Link>

        <nav className="ct-nav-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="ct-nav-link">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="ct-nav-right">
          <Link href="/trails" className="ct-nav-cta">
            Explore Chittagong
          </Link>
          <button
            type="button"
            className="ct-nav-burger"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-controls="public-mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}
