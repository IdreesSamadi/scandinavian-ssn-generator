import { joinURL, withTrailingSlash } from 'ufo';

export interface FaqItem {
  question: string;
  answer: string;
}

interface PageSeoOptions {
  title: string;
  description: string;
  /**
   * Country page name (e.g. "Sweden") — adds a BreadcrumbList schema entry
   */
  breadcrumb?: string;
  /**
   * Questions rendered on the page — also emitted as FAQPage structured data
   */
  faq?: FaqItem[];
}

/**
 * Sets title, description, canonical URL, Open Graph tags and JSON-LD
 * structured data for the current route.
 */
export const usePageSeo = ({ title, description, breadcrumb, faq }: PageSeoOptions) => {
  const route = useRoute();
  const site = useSiteConfig();
  const { app } = useRuntimeConfig();

  const origin = site.url.replace(/\/$/, '');
  // GitHub Pages serves directory indexes with a trailing slash
  const canonical = withTrailingSlash(joinURL(origin, app.baseURL, route.path));
  const homeUrl = withTrailingSlash(joinURL(origin, app.baseURL));

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical
  });

  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'url': canonical,
      'description': description,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Any',
      'browserRequirements': 'Requires JavaScript',
      'isAccessibleForFree': true,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  ];

  if (breadcrumb) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': homeUrl },
        { '@type': 'ListItem', 'position': 2, 'name': breadcrumb, 'item': canonical }
      ]
    });
  }

  if (faq?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faq.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: schemas.map(schema => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }))
  });
};
