import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";

const test = spawnSync(process.execPath, ["test.mjs"], { stdio: "inherit" });
if (test.status) process.exit(test.status ?? 1);

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const name of [
  "index.html",
  "mandate.txt",
  "mandate.th.txt",
  "helix.schema.json",
  "helix-panel.js",
  "helix-contract.mjs",
  "favicon.svg",
  "og.jpg",
  "robots.txt",
]) {
  cpSync(name, `dist/${name}`);
}
