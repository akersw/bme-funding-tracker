// api/grants.js
// Vercel serverless function — proxies requests to Google Apps Script
// to avoid CORS issues when calling from the browser.
// Place this file at: api/grants.js  (in your project root, NOT inside src/)

export default async function handler(req, res) {
  const SCRIPT_URL = process.env.VITE_GOOGLE_SCRIPT_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ success: false, error: "SCRIPT_URL not configured on server" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      const response = await fetch(SCRIPT_URL, { redirect: "follow" });
      const text = await response.text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(text);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain" },
        body,
      });
      const text = await response.text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(text);
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
