export interface SeoFieldStatus {
  field: string;
  label: string;
  present: boolean;
}

export interface SeoReadinessResult {
  status: "ready" | "needs-attention" | "incomplete";
  missingFields: string[];
}

export function evaluateTrailSeoReadiness(trail: {
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  coverMedia?: { secureUrl: string } | null;
  ogMedia?: { secureUrl: string } | null;
  status: string;
}): SeoReadinessResult {
  const fields: SeoFieldStatus[] = [
    { field: "slug", label: "Slug", present: !!trail.slug },
    { field: "metaTitle", label: "Meta title", present: !!trail.metaTitle },
    { field: "metaDescription", label: "Meta description", present: !!trail.metaDescription },
    { field: "excerpt", label: "Excerpt", present: !!trail.excerpt },
    { field: "coverMedia", label: "Cover image", present: !!(trail.coverMedia || trail.ogMedia) },
  ];

  const missing = fields.filter((f) => !f.present);

  if (trail.status !== "PUBLISHED") {
    return { status: "incomplete", missingFields: missing.map((f) => f.label) };
  }

  if (missing.length === 0) {
    return { status: "ready", missingFields: [] };
  }

  return {
    status: missing.length <= 2 ? "needs-attention" : "incomplete",
    missingFields: missing.map((f) => f.label),
  };
}

export function evaluateJournalSeoReadiness(post: {
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  coverMedia?: { secureUrl: string } | null;
  ogMedia?: { secureUrl: string } | null;
  status: string;
  publishedAt?: Date | null;
}): SeoReadinessResult {
  const fields: SeoFieldStatus[] = [
    { field: "slug", label: "Slug", present: !!post.slug },
    { field: "metaTitle", label: "Meta title", present: !!post.metaTitle },
    { field: "metaDescription", label: "Meta description", present: !!post.metaDescription },
    { field: "excerpt", label: "Excerpt", present: !!post.excerpt },
    { field: "coverMedia", label: "Cover image", present: !!(post.coverMedia || post.ogMedia) },
  ];

  const missing = fields.filter((f) => !f.present);

  if (post.status !== "PUBLISHED") {
    return { status: "incomplete", missingFields: missing.map((f) => f.label) };
  }

  if (missing.length === 0) {
    return { status: "ready", missingFields: [] };
  }

  return {
    status: missing.length <= 2 ? "needs-attention" : "incomplete",
    missingFields: missing.map((f) => f.label),
  };
}
