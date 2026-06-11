const puppeteer = require('puppeteer-core');
const fs = require('fs');

const URL = process.argv[2] || 'http://localhost:8085';
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const exe = CHROME_PATHS.find((p) => p && fs.existsSync(p));
if (!exe) {
  console.error('No Chrome/Edge found');
  process.exit(1);
}

(async () => {
  const logs = [];
  const browser = await puppeteer.launch({ executablePath: exe, headless: true });
  const page = await browser.newPage();
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}\n${err.stack}`));
  try {
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 5000));
    const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || '');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log('BODY_TEXT:', JSON.stringify(bodyText));
    console.log('BODY_BG:', bg);
    console.log('---LOGS---');
    logs.forEach((l) => console.log(l));
  } catch (e) {
    console.error('NAV_ERROR:', e.message);
    logs.forEach((l) => console.log(l));
  }
  await browser.close();
})();
