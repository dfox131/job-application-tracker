import axios from "axios";
import * as cheerio from "cheerio";

function cleanLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

function formatParagraphs(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractLeverFromJsonLd($) {
  let descriptionHtml = "";

  $('script[type="application/ld+json"]').each((_, el) => {
    if (descriptionHtml) return;

    const raw = $(el).html();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      const candidates = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of candidates) {
        if (
          item &&
          item["@type"] === "JobPosting" &&
          typeof item.description === "string"
        ) {
          descriptionHtml = item.description;
          break;
        }
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  });

  if (!descriptionHtml) {
    return "";
  }

  const decoded = cheerio.load(
    `<div id="job-description-root">${descriptionHtml}</div>`,
  );
  const root = decoded("#job-description-root");

  const blocks = [];

  root.find("h1, h2, h3, h4, h5, h6, p, li, b, strong").each((_, el) => {
    const tagName = el.tagName?.toLowerCase();
    const text = cleanLine(decoded(el).text());

    if (!text) return;

    const normalizedText = text.toLowerCase();
    const previousBlock = blocks[blocks.length - 1] || "";
    const normalizedPrevious = previousBlock.replace(/^•\s*/, "").toLowerCase();

    if (normalizedText === normalizedPrevious) {
      return;
    }

    if (tagName === "li") {
      blocks.push(`• ${text}`);
      return;
    }

    blocks.push(text);
  });

  return formatParagraphs(blocks.join("\n\n"));
}

function extractGenericStructuredText($, element) {
  const blocks = [];

  element.find("h1, h2, h3, h4, h5, h6, p, li, div").each((_, el) => {
    const node = $(el);
    const text = cleanLine(node.text());

    if (!text) return;

    const childText = cleanLine(
      node.children("h1, h2, h3, h4, h5, h6, p, li, div").text(),
    );

    if (childText && childText === text) {
      return;
    }

    if (el.tagName?.toLowerCase() === "li") {
      blocks.push(`• ${text}`);
    } else {
      blocks.push(text);
    }
  });

  return formatParagraphs(blocks.join("\n\n"));
}

export async function extractJobDescription(req, res) {
  try {
    const { jobLink } = req.body || {};

    if (!jobLink) {
      return res.status(400).json({
        ok: false,
        error: "jobLink is required.",
      });
    }

    const response = await axios.get(jobLink, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const hostname = new URL(jobLink).hostname;

    let jobDescription = "";

    if (hostname.includes("jobs.lever.co")) {
      jobDescription = extractLeverFromJsonLd($);
    }

    if (!jobDescription || jobDescription.length < 200) {
      const candidates = [
        ".posting-page",
        ".posting",
        ".main-content",
        ".content-wrapper",
        ".section-wrapper",
        ".content",
        "main",
        "article",
        "body",
      ];

      let bestText = "";

      for (const selector of candidates) {
        $(selector).each((_, el) => {
          const structuredText = extractGenericStructuredText($, $(el));
          if (structuredText.length > bestText.length) {
            bestText = structuredText;
          }
        });
      }

      jobDescription = bestText;
    }

    if (!jobDescription || jobDescription.length < 200) {
      return res.status(422).json({
        ok: false,
        error: "Could not extract a useful job description from this link.",
      });
    }

    res.json({
      ok: true,
      jobDescription,
    });
  } catch (error) {
    console.error("Job description extraction failed:", error.message);

    res.status(500).json({
      ok: false,
      error: "Failed to fetch or parse the job link.",
    });
  }
}
