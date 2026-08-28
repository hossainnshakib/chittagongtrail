import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";

const footerNavigation = {
  explore: [
    { name: "Trails", href: "/trails" },
    { name: "Journal", href: "/journal" },
    { name: "Food", href: "/food" },
    { name: "About", href: "/about" },
  ],
  social: [
    { name: "Facebook", href: "https://facebook.com/chittagongtrail" },
    { name: "Instagram", href: "https://instagram.com/chittagongtrail" },
    { name: "YouTube", href: "https://youtube.com/@chittagongtrail" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-dark-bg text-dark-text">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/chittagongtrail-wordmark.png"
              alt="Chittagong Trail"
              width={240}
              height={64}
              className="h-12 w-auto mb-4"
            />
            <p className="text-dark-text/70 text-sm">
              A personal journal of touring Chittagong — places I visit,
              stories I find, and everything in between.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {footerNavigation.explore.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-dark-text/70 hover:text-dark-accent transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Follow
            </h3>
            <ul className="space-y-3">
              {footerNavigation.social.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-text/70 hover:text-dark-accent transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Contact
            </h3>
            <a
              href="mailto:hello@chittagongtrail.com"
              className="text-dark-text/70 hover:text-dark-accent transition-colors duration-200"
            >
              hello@chittagongtrail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-dark-text/20">
          <p className="text-dark-text/50 text-sm text-center">
            © {new Date().getFullYear()} Chittagong Trail. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
