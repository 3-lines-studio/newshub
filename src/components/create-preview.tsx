import { useState } from "react";
import { validateUrl } from "../utils/url";

export function CreatePreview() {
  const [url, setUrl] = useState("");
  const isValid = validateUrl(url);

  return (
    <div className="space-y-4">
      <h1>Create preview link</h1>
      <div className="flex gap-2">
        <input
          placeholder="Create a reader mode link"
          className="text-sm rounded-lg block w-full p-2.5 border bg-stone-700 border-stone-600 placeholder-stone-400 text-white focus:ring-slate-700 focus:border-slate-700"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />

        <a
          className="inline-flex whitespace-nowrap rounded-lg text-sm px-5 py-2.5 me-2 bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-stone-800"
          href={isValid ? `/preview?link=${encodeURI(url)}` : ""}
          target="_blank"
        >
          PREVIEW
        </a>
      </div>
    </div>
  );
}
