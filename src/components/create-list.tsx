import { useState } from "react";
import { serializeUrls, validateUrl } from "../utils/url";

export function CreateList({ list = [] }: { list: string[] }) {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<string[]>(list);

  const addUrl = () => {
    const isValid = validateUrl(url);

    if (isValid) {
      setUrls([...new Set([...urls, url])]);
      setUrl("");
    }
  };

  return (
    <div className="space-y-4">
      <h1>Create a custom feed</h1>
      <div className="flex gap-2">
        <input
          placeholder="Add one by one the feeds you want"
          className="text-sm rounded-lg block w-full p-2.5 border bg-stone-700 border-stone-600 placeholder-stone-400 text-white focus:ring-slate-700 focus:border-slate-700"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />

        <button
          type="button"
          className="inline-flex whitespace-nowrap rounded-lg text-sm px-5 py-2.5 me-2 bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-stone-800"
          onClick={addUrl}
        >
          ADD
        </button>
      </div>

      {urls.length > 0 && (
        <div className="py-4">
          <a href={`/feed/${serializeUrls(urls)}`}>Use this custom feed link</a>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {urls.map((url) => (
          <div key={url} className="flex justify-between">
            <div className="">{url}</div>

            <button
              type="button"
              className="inline-flex h-10 whitespace-nowrap rounded-lg text-sm px-5 py-2.5 me-2 bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-stone-800"
              onClick={() => setUrls(urls.filter((u) => u !== url))}
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
