import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { envConfigs } from '@/config';
import { getThemePage } from '@/core/theme';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('pages.index');
  const base = (envConfigs.app_url || 'https://fable-5.org').replace(/\/$/, '');
  const canonical =
    locale === envConfigs.locale ? base : `${base}/${locale}`;

  return {
    title: t.raw('page')?.title || 'fable-5.org',
    description:
      t.raw('page')?.description ||
      'Independent Pro User Reviews of Anthropic Fable 5.',
    alternates: {
      canonical,
      languages: {
        en: base,
        zh: `${base}/zh`,
        'x-default': base,
      },
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.index');
  const page: DynamicPage = t.raw('page');
  const Page = await getThemePage('dynamic-page');

  const base = (envConfigs.app_url || 'https://fable-5.org').replace(/\/$/, '');

  // JSON-LD: WebSite + Organization (homepage only).
  // Helps Google establish the brand entity so site-links + knowledge panel
  // candidates can attach to the domain.
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'fable-5.org',
    alternateName: 'Fable 5 Reviews',
    url: base,
    description:
      'Independent Pro User Reviews of Anthropic Fable 5, published in English and Chinese.',
    inLanguage: ['en', 'zh'],
    publisher: {
      '@type': 'Organization',
      name: 'fable-5.org',
      url: base,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/og-default.png`,
        width: 1200,
        height: 630,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@fable-5.org',
        contactType: 'customer support',
        availableLanguage: ['English', 'Chinese'],
      },
    },
  };

  // JSON-LD: FAQPage derived from the homepage's FAQ section.
  // Each FAQ item from landing.json emits a Question/AcceptedAnswer pair
  // so Google can render rich-result FAQs directly in SERP.
  const faqItems =
    (page.sections?.faq?.data as { items?: Array<{ question: string; answer: string }> } | undefined)?.items ||
    [];
  const faqJsonLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <Page locale={locale} page={page} />
    </>
  );
}
