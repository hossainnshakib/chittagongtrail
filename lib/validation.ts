import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export const sanitizeContent = (dirty: string): string => {
  if (!dirty || typeof dirty !== "string") return "";
  const cleaned = sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "h2",
      "h3",
      "blockquote",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "u",
      "a",
      "img",
      "br",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const isExternal = href.startsWith("http://") || href.startsWith("https://");
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            rel: isExternal ? "noopener noreferrer" : "",
            ...(isExternal ? { target: "_blank" } : {}),
          },
        };
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
  });

  // Check for visually empty HTML such as <p></p>, <p><br></p>, whitespace only
  const stripped = cleaned.replace(/<[^>]*>/g, "").trim();
  if (!stripped && !cleaned.includes("<img")) {
    return "";
  }
  return cleaned;
};

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens");

export const trailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: slugSchema,
  excerpt: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required").transform(sanitizeContent),
  district: z.enum(["CHITTAGONG", "COX_BAZAR", "RANGAMATI", "BANDARBAN", "KHAGRACHARI"]),
  administrativeArea: z.string().optional().nullable(),
  localArea: z.string().optional().nullable(),
  terrainType: z.enum(["COAST", "HILLS", "RIVER", "CITY", "RURAL"]).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.coerce.number().int().optional().nullable(),
  coverMediaId: z.coerce.number().int().optional().nullable(),
  ogMediaId: z.coerce.number().int().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  placeType: z.enum(["TOURIST_ATTRACTION", "PLACE", "NATURAL_FEATURE", "PARK"]).default("PLACE"),
});

export const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: slugSchema,
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required").transform(sanitizeContent),
  type: z.enum(["STORY", "FOOD"]).default("STORY"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.coerce.number().int().optional().nullable(),
  coverMediaId: z.coerce.number().int().optional().nullable(),
  ogMediaId: z.coerce.number().int().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  trailId: z.coerce.number().int().optional().nullable(),
});
