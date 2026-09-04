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
    settings.socialX && { name: "X / Twitter", href: settings.socialX },
    settings.socialThreads && { name: "Threads", href: settings.socialThreads },
    settings.socialLinkedIn && { name: "LinkedIn", href: settings.socialLinkedIn },
    settings.socialTikTok && { name: "TikTok", href: settings.socialTikTok },
  ].filter(Boolean) as Array<{ name: string; href: string }>;

  const displayFooterText =
    settings.footerText && settings.footerText.trim() !== ""
      ? settings.footerText
      : "An independent exploration and storytelling platform documenting Chittagong's places, people, food, and landscapes.";

  return (
    <footer className="ct-footer">
      <div className="ct-container py-16 md:py-20">
        <div className="ct-footer-grid">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/chittagongtrail-wordmark.png"
              alt={settings.siteName}
              width={240}
              height={64}
              className="ct-footer-wordmark mb-4"
            />
            <div className="ct-footer-brand-lockup">
              <span className="ct-footer-brand-name">{settings.siteName}</span>
            </div>
            <p className="ct-footer-copy mt-3 max-w-sm">
              {displayFooterText}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="ct-footer-heading">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="ct-footer-link"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="ct-footer-heading">
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
                      className="ct-footer-link"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ct-footer-empty">Social links are coming soon.</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="ct-footer-heading">
              Contact
            </h3>
            <div className="space-y-2">
              {settings.contactEmail && settings.contactEmail.trim() !== "" ? (
                <p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="ct-footer-link"
                  >
                    {settings.contactEmail}
                  </a>
                </p>
              ) : null}
              {settings.contactPhone && settings.contactPhone.trim() !== "" ? (
                <p>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="ct-footer-link"
                  >
                    {settings.contactPhone}
                  </a>
                </p>
              ) : null}
              {settings.whatsappUrl && settings.whatsappUrl.trim() !== "" ? (
                <p>
                  <a
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ct-footer-link"
                  >
                    WhatsApp Chat
                  </a>
                </p>
              ) : null}
              {settings.contactAddress && settings.contactAddress.trim() !== "" ? (
                <p className="ct-footer-address whitespace-pre-line">
                  {settings.contactAddress}
                </p>
              ) : null}
              {!settings.contactEmail && !settings.contactPhone && !settings.whatsappUrl && !settings.contactAddress && (
                <p className="ct-footer-empty">Contact details are coming soon.</p>
              )}
            </div>
          </div>
        </div>

        <div className="ct-footer-rule mt-12 pt-8">
          <p className="ct-footer-copyright text-center">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
