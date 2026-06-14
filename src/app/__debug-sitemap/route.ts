// Temporary debug route — drop after verifying.
// Returns the raw page objects postsSource / docsSource / etc. return
// at build time, so we can see what sitemap.ts is actually working with.
import { NextResponse } from 'next/server';

import { docsSource, logsSource, pagesSource, postsSource } from '@/core/docs/source';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sources = { docsSource, postsSource, pagesSource, logsSource };
  const out: Record<string, unknown> = {};
  for (const [name, s] of Object.entries(sources)) {
    const pages = (s as { getPages(): unknown[] }).getPages();
    out[name] = pages.map((p) => ({
      path: (p as { path?: string }).path,
      slug: (p as { slug?: string[] }).slug,
      locale: (p as { locale?: string }).locale,
      url: (p as { url?: string }).url,
    }));
  }
  return NextResponse.json(out);
}
