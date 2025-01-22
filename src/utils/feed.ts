import Parser from "rss-parser";
import dayjs from "dayjs";
import { cached } from "./cache";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export type FeedItem = {
  [key: string]: any;
} & Parser.Item;

const parser = new Parser();

const newsFeedUrls = [
  "https://feeds.arstechnica.com/arstechnica/index",
  "https://techcrunch.com/feed",
  "https://www.theverge.com/rss/index.xml",
  "https://www.wired.com/feed/rss",
];

const reposFeedUrls = [
  "https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml",
  "https://mshibanami.github.io/GitHubTrendingRSS/weekly/all.xml",
  "https://mshibanami.github.io/GitHubTrendingRSS/monthly/all.xml",
];

const hnFeedUrls = ["https://hnrss.org/best"];

export const getNews = cached(
  "news:",
  async (feedUrls: string[] = newsFeedUrls) => {
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
  }
);

export const getGithubTrending = cached("gh:", async () => {
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
});

export const getHn = cached("hn:", async (feedUrls: string[] = hnFeedUrls) => {
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
});

export const preview = cached("preview:", async (url: string) => {
  const html = await fetch(url).then((r) => r.text());
  const doc = new JSDOM(html, { url });
  const reader = new Readability(doc.window.document);
  return reader.parse();
});
