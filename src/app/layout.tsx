import '@/config/style/global.css';

import type { Metadata } from 'next';
import { JetBrains_Mono, Merriweather, Plus_Jakarta_Sans } from 'next/font/google';
import { getLocale, setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

import { envConfigs } from '@/config';
import { locales } from '@/config/locale';
import { UtmCapture } from '@/shared/blocks/common/utm-capture';
import { getAllConfigs } from '@/shared/models/config';
import { getAdsService } from '@/shared/services/ads';
import { getAffiliateService } from '@/shared/services/affiliate';
import { getAnalyticsService } from '@/shared/services/analytics';
import { getCustomerService } from '@/shared/services/customer_service';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

// Root metadata: site-wide defaults for OG / Twitter / canonical / robots.
// Per-page generateMetadata overrides override these.
export const metadata: Metadata = {
  metadataBase: new URL(envConfigs.app_url || 'https://fable-5.org'),
  title: {
    default: 'fable-5.org — Independent Pro User Reviews of Anthropic Fable 5',
    template: '%s | fable-5.org',
  },
  description:
    'An independent Pro-user perspective on Anthropic Fable 5: hands-on reviews, benchmark notes, and real-world use cases — published in English and Chinese.',
  keywords: [
    'Fable 5 review',
    'Anthropic Fable 5',
    'Fable 5 Pro',
    'Claude review',
    'LLM benchmark',
    'AI model review',
  ],
  applicationName: 'fable-5.org',
  authors: [{ name: 'fable-5.org', url: 'https://fable-5.org/about' }],
  publisher: 'fable-5.org',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    siteName: 'fable-5.org',
    title: 'fable-5.org — Independent Pro User Reviews of Anthropic Fable 5',
    description:
      'Hands-on reviews and benchmark notes of Anthropic Fable 5 from an independent Pro user. EN + 中文.',
    url: envConfigs.app_url || 'https://fable-5.org',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'fable-5.org — Independent Pro User Reviews',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'fable-5.org — Independent Pro User Reviews of Anthropic Fable 5',
    description:
      'Hands-on reviews and benchmark notes of Anthropic Fable 5. EN + 中文.',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: envConfigs.app_url || 'https://fable-5.org',
    languages: {
      en: envConfigs.app_url || 'https://fable-5.org',
      zh: `${envConfigs.app_url || 'https://fable-5.org'}/zh`,
      'x-default': envConfigs.app_url || 'https://fable-5.org',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);

  const isProduction = process.env.NODE_ENV === 'production';
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

  // app url
  const appUrl = envConfigs.app_url || '';

  // ads components
  let adsMetaTags = null;
  let adsHeadScripts = null;
  let adsBodyScripts = null;

  // analytics components
  let analyticsMetaTags = null;
  let analyticsHeadScripts = null;
  let analyticsBodyScripts = null;

  // affiliate components
  let affiliateMetaTags = null;
  let affiliateHeadScripts = null;
  let affiliateBodyScripts = null;

  // customer service components
  let customerServiceMetaTags = null;
  let customerServiceHeadScripts = null;
  let customerServiceBodyScripts = null;

  if (isProduction || isDebug) {
    const configs = await getAllConfigs();

    const [adsService, analyticsService, affiliateService, customerService] =
      await Promise.all([
        getAdsService(configs),
        getAnalyticsService(configs),
        getAffiliateService(configs),
        getCustomerService(configs),
      ]);

    // get ads components
    adsMetaTags = adsService.getMetaTags();
    adsHeadScripts = adsService.getHeadScripts();
    adsBodyScripts = adsService.getBodyScripts();

    // get analytics components
    analyticsMetaTags = analyticsService.getMetaTags();
    analyticsHeadScripts = analyticsService.getHeadScripts();
    analyticsBodyScripts = analyticsService.getBodyScripts();

    // get affiliate components
    affiliateMetaTags = affiliateService.getMetaTags();
    affiliateHeadScripts = affiliateService.getHeadScripts();
    affiliateBodyScripts = affiliateService.getBodyScripts();

    // get customer service components
    customerServiceMetaTags = customerService.getMetaTags();
    customerServiceHeadScripts = customerService.getHeadScripts();
    customerServiceBodyScripts = customerService.getBodyScripts();
  }

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={envConfigs.app_favicon} />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* inject locales */}
        {locales ? (
          <>
            {locales.map((loc) => (
              <link
                key={loc}
                rel="alternate"
                hrefLang={loc}
                href={`${appUrl}${loc === 'en' ? '' : `/${loc}`}`}
              />
            ))}
          </>
        ) : null}

        {/* inject ads meta tags */}
        {adsMetaTags}
        {/* inject ads head scripts */}
        {adsHeadScripts}

        {/* inject analytics meta tags */}
        {analyticsMetaTags}
        {/* inject analytics head scripts */}
        {analyticsHeadScripts}

        {/* inject affiliate meta tags */}
        {affiliateMetaTags}
        {/* inject affiliate head scripts */}
        {affiliateHeadScripts}

        {/* inject customer service meta tags */}
        {customerServiceMetaTags}
        {/* inject customer service head scripts */}
        {customerServiceHeadScripts}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <NextTopLoader
          color="#6466F1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        <UtmCapture />

        {children}

        {/* inject ads body scripts */}
        {adsBodyScripts}

        {/* inject analytics body scripts */}
        {analyticsBodyScripts}

        {/* inject affiliate body scripts */}
        {affiliateBodyScripts}

        {/* inject customer service body scripts */}
        {customerServiceBodyScripts}
      </body>
    </html>
  );
}
