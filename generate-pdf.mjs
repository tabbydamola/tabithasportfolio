import { firefox } from "playwright";
import { spawn } from "child_process";
import { setTimeout as sleep } from "timers/promises";

const PORT = 3099;
const URL = `http://localhost:${PORT}/analysis`;
const OUTPUT = `${process.cwd()}/analysis-memo.pdf`;

// Start Next.js dev server
console.log("Starting Next.js dev server...");
const server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
  cwd: process.cwd(),
});

// Wait for server to be ready
await new Promise((resolve) => {
  server.stdout.on("data", (data) => {
    const msg = data.toString();
    if (msg.includes("Ready") || msg.includes("ready") || msg.includes(String(PORT))) {
      resolve();
    }
  });
  sleep(10000).then(resolve);
});

await sleep(2000);
console.log("Server ready. Launching Firefox...");

const browser = await firefox.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.setViewportSize({ width: 1200, height: 800 });
console.log(`Navigating to ${URL}...`);
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

// Let fonts and styles settle
await sleep(1500);

console.log("Generating PDF...");
await page.pdf({
  path: OUTPUT,
  format: "A4",
  printBackground: true,
  margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
});

console.log(`Done! PDF saved to: ${OUTPUT}`);
await browser.close();
server.kill();
process.exit(0);
