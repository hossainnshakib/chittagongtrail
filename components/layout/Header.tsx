"use client";

import { useState, useEffect, useRef } from "react";
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
  const tickingRef = useRef(false);

  useEffect(() => {
    const updateScrolledState = () => {
      const hero = document.querySelector<HTMLElement>(".ct-hero");
      const headerHeight = 64;
      const isPastHero = hero
        ? hero.getBoundingClientRect().bottom <= headerHeight + 1
        : window.scrollY > 8;

      setIsScrolled((current) => (current === isPastHero ? current : isPastHero));
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(updateScrolledState);
      }
    };

    updateScrolledState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrolledState);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrolledState);
    };
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
