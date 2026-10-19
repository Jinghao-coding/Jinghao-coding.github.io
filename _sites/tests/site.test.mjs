import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const adapterRoot = resolve(testDirectory, "..");
const htmlPath = resolve(adapterRoot, "dist", "client", "index.html");

test("build contains deployable worker and metadata", async () => {
  await access(resolve(adapterRoot, "dist", "server", "index.js"));
  await access(resolve(adapterRoot, "dist", ".openai", "hosting.json"));
});

test("academic profile contains current publication content", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.match(html, /DeepShare: Assurance-Driven Deep Learning Job Scheduling/);
  assert.match(html, /Jinghao Wang<\/strong>, Yihang Zhou, Xiao Zhou, Xinlei Zheng/);
  assert.match(html, /IEEE CLUSTER/);
  assert.match(html, /Maestro: Workload-Aware Cross-Cluster Scheduling/);
  assert.match(html, /IEEE ICDCS 2026/);
  assert.match(html, /LogAD: A Multi-Feature Fusion Approach for Log Anomaly Detection/);
  assert.match(html, /id="pub-logad"/);
  assert.match(html, /Guangzu Wang, Lingzhi Zhang, <strong>Jinghao Wang<\/strong>, Tianyu Wo, Xu Wang, Chunming Hu/);
  assert.match(html, /10\.1109\/JCC67032\.2025\.00016/);
  assert.match(html, /RESCAPE: A Resource Estimation System/);
  assert.match(html, /Laplace: Predictive Sandbox Orchestration for LLM Agents/);
  assert.match(html, /Yihui Zhang, Tianyu Wo, <strong>Jinghao Wang<\/strong>/);
  assert.match(html, /SparseRec: Predictive GPU Sharing and Data-Aware Scheduling/);
  assert.match(html, /ACM SIGOPS ATC 2026 Workshop/);
  assert.match(html, /NaviPerf: Architecture-Aware Performance Prediction for LLM Serving on Ascend NPUs/);
  assert.match(html, /Xiao Zhou, <strong>Jinghao Wang<\/strong>, Zeying Wang, Yifeng Zhang/);
  assert.match(html, /PrecisionProbe: Non-intrusive Performance Analysis Tool/);
  assert.match(html, /App Uninstalls Prediction: A Machine Learning and Time Series Mining Approach/);
  assert.match(html, /id="preprints"[\s\S]*ElastiCo:[\s\S]*arXiv preprint, 2026/);
  assert.doesNotMatch(html, /Concerto:|SagePilot:/);
  assert.match(html, /mailto:wang_jinghao@buaa\.edu\.cn/);
  assert.match(html, /AI Infrastructure Intern/);
  assert.match(html, /Global E-commerce, Lumen/);
  assert.match(html, /JQ Investments/);
  assert.match(html, /quantitative market-data processing and task orchestration tools/);
  assert.match(html, /Jul 2025 – Oct 2025/);
  assert.match(html, /Data Storage Department/);
  assert.match(html, /Kunpeng CPUs and Ascend NPUs/);
});

test("page avoids placeholder links and exposes essential metadata", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.doesNotMatch(html, /href=["']#["']/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.match(html, /figs\/og\.png/);
});

test("navigation and local resources resolve in the built site", async () => {
  const html = await readFile(htmlPath, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "Element IDs must be unique");

  for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(fragment), `Missing anchor: ${fragment}`);
  }
  for (const [, path] of html.matchAll(/(?:src|href)="((?:css|js|figs)\/[^\"]+)"/g)) {
    await access(resolve(adapterRoot, "dist", "client", path));
  }
});
