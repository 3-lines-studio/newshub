import Parser from "rss-parser";
import dayjs from "dayjs";

export type FeedItem = {
  [key: string]: any;
} & Parser.Item;

const parser = new Parser();

const newsFeedUrls = [
  "https://feeds.arstechnica.com/arstechnica/index",
  "https://techcrunch.com/feed",
  "https://www.theverge.com/rss/index.xml",
  "https://www.wired.com/feed/rss",
  "https://hnrss.org/best",
];

const reposFeedUrls = [
  "https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml",
  "https://mshibanami.github.io/GitHubTrendingRSS/weekly/all.xml",
  "https://mshibanami.github.io/GitHubTrendingRSS/monthly/all.xml",
];

export const getNews = async (feedUrls = newsFeedUrls) => {
  const feeds = await Promise.all(
    feedUrls.map((url) =>
      parser
        .parseURL(url)
        .catch(() => console.error(new URL(url).host, " failed"))
    )
  );

  return feeds
    .filter(Boolean)
    .flatMap((feed) => feed?.items!)
    .sort((a, b) => (dayjs(a.pubDate).isBefore(b.pubDate) ? 1 : -1));
};

export const getGithubTrending = async () => {
  const feeds = await Promise.all(
    reposFeedUrls.map((url) =>
      parser
        .parseURL(url)
        .catch(() => console.error(new URL(url).host, " failed"))
    )
  );

  const feedMap = new Map<string, FeedItem>();

  for (const feed of feeds) {
    if (!feed) {
      continue;
    }

    feedMap.set(feed?.link!, feed!);
  }

  return [...feedMap.values()].flatMap((feed) => feed?.items!);
};
