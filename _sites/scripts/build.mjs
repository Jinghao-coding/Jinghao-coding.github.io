import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const adapterRoot = resolve(scriptDirectory, "..");
const siteRoot = resolve(adapterRoot, "..");
const outputRoot = resolve(adapterRoot, "dist");
const clientRoot = resolve(outputRoot, "client");
const serverRoot = resolve(outputRoot, "server");
const metadataRoot = resolve(outputRoot, ".openai");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
}

await rm(outputRoot, { recursive: true, force: true });
await Promise.all([
  mkdir(clientRoot, { recursive: true }),
  mkdir(serverRoot, { recursive: true }),
  mkdir(metadataRoot, { recursive: true })
]);

for (const path of ["index.html", "css", "js", "figs"]) {
  await cp(resolve(siteRoot, path), resolve(clientRoot, path), { recursive: true });
}

for (const optionalFile of ["404.html", "CNAME", "robots.txt", "sitemap.xml"]) {
  const source = resolve(siteRoot, optionalFile);
  if (await exists(source)) {
    await cp(source, resolve(clientRoot, optionalFile));
  }
}

await cp(
  resolve(adapterRoot, ".openai", "hosting.json"),
  resolve(metadataRoot, "hosting.json")
);

const workerSource = `const SECURITY_HEADERS = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function secure(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (response.status === 404 && !url.pathname.split("/").pop().includes(".")) {
      response = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    const contentType = response.headers.get("Content-Type") || "";
    if (response.ok && contentType.includes("text/html")) {
      const headers = new Headers(response.headers);
      const html = (await response.text()).replaceAll(
        "https://jinghao-coding.github.io/figs/og.png",
        new URL("/figs/og.png", request.url).href
      );
      response = new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return secure(response);
  }
};
`;

await writeFile(resolve(serverRoot, "index.js"), workerSource);

const html = await readFile(resolve(clientRoot, "index.html"), "utf8");
if (!html.includes("Jinghao Wang") || !html.includes("DeepShare")) {
  throw new Error("Built site is missing required academic profile content.");
}

console.log(`Built static site from ${siteRoot}`);
