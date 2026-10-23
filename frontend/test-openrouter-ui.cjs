const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:4173/';
const SCREENSHOT_DIR = path.join(__dirname, 'openrouter-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('Launching Chrome for OpenRouter UI verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to ' + TARGET_URL);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  // 1. Initial Landing Page with Nemotron 3.5 AI Badge
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-landing-nemotron-badge.png') });
  console.log('Captured 01-landing-nemotron-badge.png');

  // 2. Click Workspace tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wsBtn = btns.find(b => b.innerText.includes('Query Console') || b.innerText.includes('Workspace') || b.innerText.includes('Launch'));
    if (wsBtn) wsBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-workspace-ready.png') });
  console.log('Captured 02-workspace-ready.png');

  // 3. Enter query and submit
  await page.type('input[type="text"]', 'Show top performing AI companies in 2024');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-clarification-with-embedding.png') });
  console.log('Captured 03-clarification-with-embedding.png');

  // 4. Resolve clarification option
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const revBtn = btns.find(b => b.innerText.includes('Highest Revenue') || b.innerText.includes('Revenue'));
    if (revBtn) revBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-sql-with-nemotron-inspector.png') });
  console.log('Captured 04-sql-with-nemotron-inspector.png');

  // 5. Expand the Neural Vector Embedding Inspector
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const expandBtn = btns.find(b => b.title === 'Expand' || b.getAttribute('title') === 'Expand');
    if (expandBtn) expandBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-expanded-vector-similarity.png') });
  console.log('Captured 05-expanded-vector-similarity.png');

  await browser.close();
  console.log('Verification completed successfully!');
})();
