import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import {
  docsSource,
  logsSource,
  pagesSource,
  postsSource,
} from '@/core/docs/source';

// All supported locales (must match src/config/locale/index.ts).
// Default locale ('en') has no URL prefix; others get /<locale>/.
const LOCALES = ['en', 'zh'] as const;
const DEFAULT_LOCALE = envConfigs.locale || 'en';

type Page = { slug: string[]; locale?: string };

// Get the canonical path under the default locale (no /en/ prefix).
function defaultPath(p: Page): string {
  if (p.locale && p.locale !== DEFAULT_LOCALE) {
    // Source loader tagged this page as a non-default locale — derive its
    // default-locale counterpart by stripping the /<locale>/ prefix from
    // slug. The slug form is "<locale>/<rest>" for non-default pages.
    const stripped = p.slug.filter((s) => s !== p.locale);
    return '/' + stripped.join('/');
  }
  return '/' + p.slug.join('/');
}

// Compute the localized URL for a page.
function localizedUrl(p: Page, locale: string): string {
  const base = envConfigs.app_url.replace(/\/$/, '');
  const dp = defaultPath(p);
  if (locale === DEFAULT_LOCALE) {
    return `${base}${dp}`;
  }
  // Insert locale segment after the leading slash.
  return `${base}/${locale}${dp === '/' ? '' : dp}`;
}

// Flatten a source's pages + their per-locale pages into a flat list.
function flat(source: { getPages(): Page[] }): Page[] {
  const out: Page[] = [];
  for (const p of source.getPages()) {
    out.push(p);
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = envConfigs.app_url.replace(/\/$/, '');

  // Static, non-content routes that should always be indexed.
  const staticPaths = ['/', '/blog', '/docs'];

  // All content pages from fumadocs sources.
  const contentPages = [
    ...flat(docsSource),
    ...flat(postsSource),
    ...flat(pagesSource),
    ...flat(logsSource),
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static paths.
  for (const path of staticPaths) {
    entries.push({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((locale) => [
            locale,
            locale === DEFAULT_LOCALE
              ? `${base}${path}`
              : `${base}/${locale}${path === '/' ? '' : path}`,
          ]),
        ),
      },
    });
  }

  // Content pages.
  for (const p of contentPages) {
    const dp = defaultPath(p);
    // Skip pure locale-variant duplicates; they are surfaced via alternates.
    const isNonDefault = p.locale && p.locale !== DEFAULT_LOCALE;
    if (isNonDefault) continue;
    entries.push({
      url: `${base}${dp}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((locale) => [locale, localizedUrl(p, locale)]),
        ),
      },
    });
  }

  return entries;
}