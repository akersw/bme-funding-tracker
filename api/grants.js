// api/grants.js
// Vercel serverless function — proxies requests to Google Apps Script
// to avoid CORS issues when calling from the browser.
// Place this file at: api/grants.js  (in your project root, NOT inside src/)

export default async function handler(req, res) {
  const SCRIPT_URL = process.env.VITE_APPS_SCRIPT_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ success: false, error: "VITE_APPS_SCRIPT_URL not found in Vercel environment." });
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
     const data = await response.json(); // Use .json() instead of .text() to catch errors early
     return res.status(200).json(data);
   }

   if (req.method === "POST") {
     const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
     const response = await fetch(SCRIPT_URL, {
       method: "POST",
       redirect: "follow",
       headers: { "Content-Type": "text/plain" },
       body,
     });
     const data = await response.json(); // Use .json() here too
     return res.status(200).json(data);
   }

    return res.status(405).json({ success: false, error: "Method not allowed" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
