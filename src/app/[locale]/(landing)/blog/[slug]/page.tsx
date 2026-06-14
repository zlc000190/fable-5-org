import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { Empty } from '@/shared/blocks/common';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const base = (envConfigs.app_url || 'https://fable-5.org').replace(/\/$/, '');
  const canonicalUrl =
    locale !== envConfigs.locale
      ? `${base}/${locale}/blog/${slug}`
      : `${base}/blog/${slug}`;

  const post = await getPost({ slug, locale });
  if (!post) {
    return {
      title: `${slug} | ${t('title')}`,
      description: t('description'),
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${base}/blog/${slug}`,
          zh: `${base}/zh/blog/${slug}`,
          'x-default': `${base}/blog/${slug}`,
        },
      },
    };
  }

  const otherLocaleUrl =
    locale === 'en'
      ? `${base}/zh/blog/${slug}`
      : `${base}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${base}/blog/${slug}`,
        zh: `${base}/zh/blog/${slug}`,
        'x-default': `${base}/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: 'fable-5.org',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
      images: [
        {
          url: '/og-default.png',
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-default.png'],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    return <Empty message={`Post not found`} />;
  }

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  // JSON-LD: Article schema for Google rich results.
  const base = (envConfigs.app_url || 'https://fable-5.org').replace(/\/$/, '');
  const articleUrl =
    locale !== envConfigs.locale
      ? `${base}/${locale}/blog/${slug}`
      : `${base}/blog/${slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    inLanguage: locale,
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: `${base}/og-default.png`,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: 'fable-5.org',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'fable-5.org',
      logo: {
        '@type': 'ImageObject',
        url: `${base}/og-default.png`,
        width: 1200,
        height: 630,
      },
    },
    datePublished: post.created_at || new Date().toISOString(),
    dateModified: post.created_at || new Date().toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
