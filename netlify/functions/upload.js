const fetch = require("node-fetch");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const boundary = event.headers["content-type"].split("boundary=")[1];
  const bodyBuffer = Buffer.from(event.body, "base64");
  const parts = bodyBuffer.toString().split(`--${boundary}`);

  const filePart = parts.find(part => part.includes("Content-Disposition: form-data; name=\"file\""));
  if (!filePart) return { statusCode: 400, body: "No file provided" };

  const filenameMatch = /filename="(.+?)"/.exec(filePart);
  const filename = filenameMatch?.[1] || "upload.dat";
  const content = filePart.split("\r\n\r\n")[1].split("\r\n--")[0];

  const repo = "louisenfest/lou-archiv-2025";
  const path = `content/media/${filename}`;
  const token = process.env.GITHUB_TOKEN;

  // Hole SHA falls Datei schon existiert
  let sha = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` }
    });
    const data = await r.json();
    sha = data.sha;
  } catch {}

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Upload ${filename}`,
      content: Buffer.from(content).toString("base64"),
      sha
    })
  });

  if (!res.ok) {
    const error = await res.text();
    return { statusCode: 500, body: `Fehler beim Hochladen: ${error}` };
  }

  return { statusCode: 200, body: "Datei erfolgreich hochgeladen 🎉" };
};
