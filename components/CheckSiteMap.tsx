"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckSitemap() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [inputUrls, setInputUrls] = useState("");
  const [results, setResults] = useState<
    { url: string; isPresent: boolean }[] | null
  >(null);
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
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Check URLs in Sitemap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sitemap URL:
            </label>
            <Input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Input URLs (one per line):
            </label>
            <Textarea
              value={inputUrls}
              onChange={(e) => setInputUrls(e.target.value)}
              placeholder="https://example.com/page-1\nhttps://example.com/page-2"
              rows={5}
            />
          </div>
          <Button onClick={handleCheck} className="w-full">
            Check URLs
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.map(({ url, isPresent }) => (
                <li
                  key={url}
                  className={isPresent ? "text-green-600" : "text-red-600"}
                >
                  {url}: {isPresent ? "Present" : "Not Present"}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-red-600 text-sm font-medium">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
