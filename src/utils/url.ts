export function validateUrl(url: string) {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  }
}

export function serializeUrls(urls: string[]) {
  return btoa(urls.join(","));
}

export function deserializeUrls(urls: string) {
  return atob(urls).split(",");
}
