import type { Metadata } from "next";

/**
 * Canonical origin for this app. The site is also served on every PR-preview
 * subdomain, so canonical and Open Graph URLs are pinned to the production host
 * rather than derived from the request — that is what stops the previews from
 * competing with production as duplicate content.
 */
export const SITE_URL = "https://taiikusai.2026.kss-it.com";

/** Short site name: the `%s | …` title suffix and og:site_name. */
export const SITE_NAME = "体育祭2026";

export const SITE_DESCRIPTION =
  "東京都立小石川中等教育学校 体育祭2026 公式サイト。テーマ「今日、勝ちにきました」。予備大・本大の日程とお知らせ。";

/**
 * Shared Open Graph image. Not a purpose-built 1200×630 card yet, and
 * deliberately not the sports-theme SVG: social crawlers do not render SVG.
 */
const OG_IMAGE = {
  url: "/theme.png",
  width: 1849,
  height: 878,
  alt: SITE_NAME,
};

type IndexablePage = {
  /** Page title WITHOUT the site suffix — `title.template` appends it. */
  title: string;
  /**
   * Set on the top page only, where the title already carries the site name
   * and `title.template` would otherwise repeat it.
   */
  isTitleAbsolute?: boolean;
  description: string;
  /** Root-relative path; `metadataBase` resolves it against SITE_URL. */
  path: string;
  isIndexable?: true;
};

type NonIndexablePage = {
  title: string;
  description: string;
  isIndexable: false;
};

type PageMetadataOptions = IndexablePage | NonIndexablePage;

/**
 * Title, description, canonical URL and social cards for one page.
 *
 * Every page builds its metadata through this rather than inheriting from the
 * root layout, because Next merges metadata objects only **shallowly**: a page
 * that sets any `openGraph` field replaces the layout's entire `openGraph`
 * object, silently dropping og:site_name, og:locale and the image. The same
 * applies to `twitter` and `alternates`.
 */
export function pageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description } = options;

  if (options.isIndexable === false) {
    return { title, description, robots: { index: false, follow: false } };
  }

  const { path, isTitleAbsolute = false } = options;

  return {
    title: isTitleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
