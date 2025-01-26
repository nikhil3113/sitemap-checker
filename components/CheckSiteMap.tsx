"use client"

import { useState } from "react";
import axios from "axios";

export default function CheckSitemap() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [inputUrls, setInputUrls] = useState("");
  const [results, setResults] = useState<{ url: string; isPresent: boolean }[] | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setError("");
    setResults(null);

    try {
      const inputUrlsArray = inputUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0); // Split URLs by newlines and trim extra spaces

      const response = await axios.post("/api/check-sitemap", {
        sitemapUrl,
        inputUrls: inputUrlsArray,
      });
      setResults(response.data.results);
    } catch (err) {
      setError("An error occurred while checking the sitemap.");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Check URLs in Sitemap</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sitemap URL:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={sitemapUrl}
          onChange={(e) => setSitemapUrl(e.target.value)}
          placeholder="https://example.com/sitemap.xml"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Input URLs (one per line):</label>
        <textarea
          className="w-full p-2 border rounded"
          value={inputUrls}
          onChange={(e) => setInputUrls(e.target.value)}
          placeholder="https://example.com/page-1\nhttps://example.com/page-2"
          rows={5}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCheck}
      >
        Check
      </button>

      {results && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Results:</h2>
          <ul className="list-disc pl-5">
            {results.map(({ url, isPresent }) => (
              <li key={url} className={isPresent ? "text-green-500" : "text-red-500"}>
                {url}: {isPresent ? "Present" : "Not Present"}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
