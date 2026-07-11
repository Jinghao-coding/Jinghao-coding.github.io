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
  assert.match(html, /IEEE ICDCS[\s\S]*CCF-B/);
  assert.match(html, /LogAD: A Multi-Feature Fusion Approach for Log Anomaly Detection/);
  assert.match(html, /id="pub-logad"/);
  assert.match(html, /Guangzu Wang, Lingzhi Zhang, <strong>Jinghao Wang<\/strong>, Tianyu Wo, Xu Wang, Chunming Hu/);
  assert.match(html, /10\.1109\/JCC67032\.2025\.00016/);
  assert.match(html, /RESCAPE: A Resource Estimation System/);
  assert.match(html, /IEEE JCC[\s\S]*CCF-C/);
  assert.match(html, /mailto:wang_jinghao@buaa\.edu\.cn/);
  assert.match(html, /AI Infrastructure Intern/);
  assert.match(html, /ByteDance · TikTok Lumen AI Infra/);
  assert.match(html, /job submission, scheduling, preemption, and production operations/);
  assert.match(html, /Selected Publications/);
  assert.match(html, /Research Interests/);
});

test("page avoids placeholder links and exposes essential metadata", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.doesNotMatch(html, /href=["']#["']/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /aria-controls="navLinks"/);
  assert.match(html, /figs\/og\.png/);
});
