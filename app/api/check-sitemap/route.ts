import axios from "axios";
import { parseStringPromise } from "xml2js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Only POST requests are allowed" });
  }

  const body = await req.json();
  const { sitemapUrl, inputUrls } = body;

  if (!sitemapUrl || !Array.isArray(inputUrls)) {
    return NextResponse.json(
      {
        message: "Please provide both sitemap URL and input URL",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch the sitemap
    const { data: sitemapXml } = await axios.get(sitemapUrl);

    // Parse the XML to JSON
    const parsedSitemap = await parseStringPromise(sitemapXml);

    // Extract all URLs from the sitemap
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const urls = parsedSitemap.urlset.url.map((entry: any) => entry.loc[0]);

    // Check if the input URL exists in the sitemap
    const results = inputUrls.map((url: string) => ({
      url,
      isPresent: urls.includes(url),
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error checking sitemap:", error);
    return NextResponse.json(
      {
        message: "An error occurred while checking the sitemap",
      },
      {
        status: 500,
      }
    );
  }
}
