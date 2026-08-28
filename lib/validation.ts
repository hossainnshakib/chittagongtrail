import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "img",
      "br",
      "hr",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }, true),
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
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
