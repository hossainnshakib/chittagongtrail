import Link from "next/link";
import Image from "next/image";
import { getPublicSiteSettings } from "@/lib/settings-service";

export async function Footer() {
  const settings = await getPublicSiteSettings();

  const exploreNav = [
    { name: "Trails", href: "/trails" },
    { name: "Journal", href: "/journal" },
    { name: "Food", href: "/food" },
    { name: "About", href: "/about" },
  ];

  const socialLinks = [
    settings.socialFacebook && { name: "Facebook", href: settings.socialFacebook },
    settings.socialInstagram && { name: "Instagram", href: settings.socialInstagram },
    settings.socialYouTube && { name: "YouTube", href: settings.socialYouTube },
  ].filter(Boolean) as Array<{ name: string; href: string }>;

  const displayFooterText =
    settings.footerText && settings.footerText.trim() !== ""
      ? settings.footerText
      : "An independent exploration and storytelling platform documenting Chittagong's places, people, food, and landscapes.";

  return (
    <footer className="bg-dark-bg text-dark-text">
      <div className="ct-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/chittagongtrail-wordmark.png"
              alt={settings.siteName}
              width={240}
              height={64}
              className="h-12 w-auto mb-4"
            />
            <p className="text-dark-text/70 text-sm">
              {displayFooterText}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreNav.map((item) => (
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
            {socialLinks.length > 0 ? (
              <ul className="space-y-3">
                {socialLinks.map((item) => (
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
            ) : (
              <p className="text-dark-text/50 text-sm">No social links configured.</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Contact
            </h3>
            {settings.contactEmail && settings.contactEmail.trim() !== "" ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-dark-text/70 hover:text-dark-accent transition-colors duration-200"
              >
                {settings.contactEmail}
              </a>
            ) : (
              <p className="text-dark-text/50 text-sm">Contact email not configured.</p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-dark-text/20">
          <p className="text-dark-text/50 text-sm text-center">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
