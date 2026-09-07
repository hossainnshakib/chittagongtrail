# A7R.9.3 local demo and footer audit

Status: implementation and automated checks complete; browser verification, public-origin configuration, owner media, and commit/push remain pending. No production, cPanel, or A7R.10 deployment is claimed.

Initial and final HEAD: `420158836eb7f2982a3986c651c5aa9f3cd4c8fa`.
Branch: `master`. Successful fetch and final alignment check: `HEAD...origin/master = 0 0`.
The initial tree was **not clean**: 37 existing changed/untracked A7R.9.2 paths, including the schema and an already-applied migration. Those changes were preserved. The final tree remains uncommitted. Approval to include that preceding work in the requested coherent commit is pending; no commit or push was attempted.

Requested commit message: `feat: add local demo data and compact footer polish`.

## Demo command and exact results

Run `npm run db:seed:demo` against the local MySQL database `chittagong_trail`. The runner loads `.env` without overriding the process environment. It refuses production before constructing a Prisma client, and refuses remote hosts, other databases, non-MySQL URLs, and URL query overrides. It never logs a connection string.

Both local runs exited 0. Values below are created / updated / skipped records:

| Structure | First run | Second run |
|---|---|---|
| Trails | 5 / 0 / 0 | 0 / 5 / 0 |
| Stories | 3 / 0 / 0 | 0 / 3 / 0 |
| Food (Journal FOOD type) | 3 / 0 / 0 | 0 / 3 / 0 |
| Site settings | 0 / 1 / 0 | 0 / 0 / 1 |
| Public pages | 0 / 5 / 0 | 0 / 0 / 5 |
| Homepage sections | 0 / 4 / 1 | 0 / 0 / 5 |
| Trail gallery | 0 / 0 / 0 | 0 / 0 / 0 |
| Homepage gallery | 0 / 0 / 0 | 0 / 0 / 0 |

There are five Trail records across the five districts, three Stories, and three Food posts. Four Trails, three Stories, and three Food posts are featured. Content records use stable `demo-a7r93-` slugs and a dataset marker. Both must match before an existing content record can be updated. A collision aborts the transaction before writes. No arbitrary record deletion or clear command exists.

Shared settings lack a dataset ownership field. As a bounded exception for the explicitly requested site configuration, the seed initializes only empty fields on the fixed existing settings rows; it does not overwrite owner text, disabled flags, or media references. Existing page and section definitions are shared with the CMS, rather than copied into a second source of truth. Hero/introduction/seasonal/closing copy remains in SiteSettings.

The real production-guard command returned exit 1 and `Demo seed refuses NODE_ENV=production`. The guard test also verifies refusal before database access.

There were zero MediaAssets. No media records or gallery links were invented. Hero/seasonal/cover/OG references remain nullable. Gallery empty states therefore remain until valid owner images are available. The seed can reuse existing image assets only after checking the HTTPS Cloudinary host, configured cloud path, and allowed public-ID namespace. No Cloudinary upload or deletion occurred.

Demo map points are approximate editorial samples. Contact fields use an example email, fictional phone/WhatsApp number, and social-platform homepage links; replace these with owner details before publishing.

## Footer and audit fixes

The dark bundled wordmark was replaced in the default footer with the existing official circular mark and light live text. No logo was generated or image edited. The mark is 44px, clipped circularly to avoid a rectangular tile. A CMS-selected wordmark still suppresses duplicate live text. Selected assets remain settings-driven; an owner-selected dark wordmark may require replacement with an official light asset.

Footer padding is now 32px / 40px, with a smaller copyright gap, less list spacing, and existing 44px link touch targets. Brand, Explore, Follow, Contact, and copyright remain. Text retains light colors on the dark background. Grid breakpoints and wrapping support narrow screens, but 1440/1024/768/390px visual approval is pending.

Two regressions were fixed: empty explicit page SEO overrides now reach global defaults, and a noindex/excluded homepage is no longer reintroduced into the sitemap. Static pages without settings use the existing public defaults. Food stays under `/food`.

## Quality gates

| Gate | Baseline | Final |
|---|---|---|
| npm test | exit 0; 655 pass | exit 0; 669 pass |
| npm run lint | exit 0 | exit 0 |
| npx tsc --noEmit | exit 0 | exit 0 |
| npm run build | exit 0 | exit 0 |
| npx prisma generate | not requested at baseline | exit 0 |
| npx prisma validate | exit 0 | exit 0 |
| npx prisma migrate status | exit 0; 6 applied | exit 0; 6 applied |
| npm audit --json | not requested at baseline | exit 0; 0 vulnerabilities |
| git diff --check | not requested at baseline | exit 0 |

Initial sandbox attempts failed to spawn test/compiler processes or fetch Prisma engine checksums. Those infrastructure failures were retried with approved process/network access before establishing the successful baseline. An intermediate test run had one outdated package-file assertion; it now compares actual dependency maps and still protects the lockfile and Cloudinary implementation. An intermediate lint run rejected test helper variables named `module`; they were renamed and lint rerun successfully. No failing intermediate run is represented as passing.

Baseline raw TAP summary:

```text
1..43
# tests 655
# suites 162
# pass 655
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2130.2183
```

Final raw TAP summary:

```text
1..45
# tests 669
# suites 164
# pass 669
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2586.8068
```

Arithmetic: tests/pass `655 + 8 + 6 = 669`; suites `162 + 1 + 1 = 164`; files `22 + 2 = 24`. Failures, skipped, cancelled, and todo remain zero. Existing files retain their baseline test counts. Final per-file runs independently returned the counts below; their sum matches the full TAP run. Raw local logs are retained in ignored `.local-qa/` and must not be committed.

| Test file | Baseline tests | Final tests/pass | Suites | Fail | Skipped | Exit |
|---|---:|---:|---:|---:|---:|---:|
| admin-contrast.test.ts | 29 | 29/29 | 11 | 0 | 0 | 0 |
| admin-login-regression.test.ts | 22 | 22/22 | 7 | 0 | 0 | 0 |
| admin-navigation.test.ts | 16 | 16/16 | 5 | 0 | 0 | 0 |
| admin-shell.test.ts | 65 | 65/65 | 20 | 0 | 0 | 0 |
| content-list-behavior.test.ts | 26 | 26/26 | 7 | 0 | 0 | 0 |
| csrf.test.ts | 11 | 11/11 | 1 | 0 | 0 | 0 |
| dashboard-service.test.ts | 10 | 10/10 | 5 | 0 | 0 | 0 |
| demo-seed.test.ts | 0 | 8/8 | 1 | 0 | 0 | 0 |
| food-type-integrity.test.ts | 58 | 58/58 | 20 | 0 | 0 | 0 |
| hero-video-fk.test.ts | 46 | 46/46 | 9 | 0 | 0 | 0 |
| hero-video-integrity.test.ts | 43 | 43/43 | 9 | 0 | 0 | 0 |
| hero-video-settings.test.ts | 24 | 24/24 | 7 | 0 | 0 | 0 |
| homepage-cms.test.ts | 97 | 97/97 | 18 | 0 | 0 | 0 |
| homepage-curation.test.ts | 19 | 19/19 | 8 | 0 | 0 | 0 |
| journal-management.test.ts | 4 | 4/4 | 1 | 0 | 0 | 0 |
| media-lifecycle.test.ts | 131 | 131/131 | 20 | 0 | 0 | 0 |
| public-audit.test.ts | 0 | 6/6 | 1 | 0 | 0 | 0 |
| public-polish.test.ts | 12 | 12/12 | 1 | 0 | 0 | 0 |
| public-seo-content.test.ts | 7 | 7/7 | 1 | 0 | 0 | 0 |
| seo-readiness.test.ts | 8 | 8/8 | 3 | 0 | 0 | 0 |
| seo-workspace-final-qa.test.ts | 14 | 14/14 | 6 | 0 | 0 | 0 |
| site-settings.test.ts | 5 | 5/5 | 1 | 0 | 0 | 0 |
| tiptap-seo.test.ts | 4 | 4/4 | 1 | 0 | 0 | 0 |
| trail-management.test.ts | 4 | 4/4 | 1 | 0 | 0 | 0 |

## HTTP and browser verification

The built site was served locally on port 3100. `/`, `/trails`, `/journal`, `/food`, `/about`, and one seeded detail page per content type returned 200. Each HTML page had one H1 and the footer mark markup. Demo content appeared on the indexes and detail pages. `/sitemap.xml` and `/robots.txt` returned 200. Admin Site Settings, Public Pages, and Homepage Sections returned 307 redirects to login when unauthenticated.

The local environment has no valid configured public HTTPS origin. Consequently canonical tags and sitemap URLs are omitted, the live sitemap is empty, and robots has no sitemap reference. This prevents localhost canonicals but is an **unfulfilled live indexing check** until the owner sets the real `NEXT_PUBLIC_SITE_URL` or `SITE_URL` and rebuilds. Runtime tests with an isolated configured origin verify sitemap inclusion/exclusion, published query filters, Food paths, robots rules, canonical paths, and safely serialized JSON-LD.

Tests exercise actual server modules with isolated database/cache boundaries for saved page title/description reload, section content retrieval, and SEO precedence. Existing source contracts verify rendering integration. These are not a substitute for authenticated browser save/reload testing.

No browser tool was available. Authenticated CMS interactions and visual checks at all four widths remain pending. No visual approval is claimed.

## Safety and file scope

This phase did not edit the schema, create a migration, change an applied migration, execute destructive SQL, mutate production, upload to Cloudinary, or change authentication/CSRF/CSP/media-deletion implementation. The schema/migration changes visible in git were already present at preflight. No dependencies changed. No environment file, credential, screenshot, build output, or temporary QA file is included in the intended commit.

Exact files created or edited in this phase:

```text
.gitignore
app/globals.css
app/sitemap.ts
components/layout/Footer.tsx
docs/phase-a7r-9-3-report.md
lib/demo-data.ts
lib/demo-seed.ts
lib/public-content-definitions.ts
lib/public-content.ts
lib/seo.ts
package.json
scripts/seed-demo.ts
tests/demo-seed.test.ts
tests/public-audit.test.ts
tests/public-polish.test.ts
tests/public-seo-content.test.ts
```

Other paths already dirty at preflight and untouched by this phase:

```text
app/about/page.tsx
app/admin/(protected)/settings/footer/page.tsx
app/admin/(protected)/settings/homepage-sections/page.tsx
app/admin/(protected)/settings/page.tsx
app/admin/(protected)/settings/pages/page.tsx
app/api/admin/homepage/sections/route.ts
app/api/admin/page-seo/route.ts
app/food/[slug]/page.tsx
app/food/page.tsx
app/journal/[slug]/page.tsx
app/journal/page.tsx
app/layout.tsx
app/page.tsx
app/robots.ts
app/trails/[slug]/page.tsx
app/trails/page.tsx
components/admin/navigation.ts
components/home/DestinationsGrid.tsx
components/home/ExperiencesGrid.tsx
components/home/FoodGallery.tsx
components/home/Hero.tsx
components/home/Journeys.tsx
components/home/UneditedGallery.tsx
components/layout/Header.tsx
hooks/useGsap.ts
lib/media-service.ts
lib/settings-service.ts
lib/site-url.ts
prisma/schema.prisma
prisma/migrations/20260905000000_add_public_page_seo_and_footer_brand/migration.sql
```

Owner actions: approve inclusion of the preceding A7R.9.2 work for commit/push; configure the real public HTTPS origin; upload valid official/owner media and curate galleries; replace sample contact/social details; complete authenticated browser and responsive footer verification.
