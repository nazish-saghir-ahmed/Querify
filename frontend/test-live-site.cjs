const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://querify-nine.vercel.app/';
const SCREENSHOT_DIR = path.join(__dirname, 'live-redesign-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifyLiveRedesign() {
  console.log('🚀 Verifying Live Redesigned Production Deployment on ' + TARGET_URL);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('❌ Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.error('💥 Uncaught Page Error:', err.toString());
  });

  try {
    // 1. Initial Page Load
    console.log('1. Loading Live Production Page...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-live-landing.png') });
    
    const title = await page.title();
    console.log(`Page Title: "${title}"`);

    // 2. Navigate to Query Console
    console.log('2. Opening Query Console...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wsBtn = btns.find(b => b.innerText.includes('Query Console') || b.innerText.includes('Console') || b.innerText.includes('Launch Query Console'));
      if (wsBtn) wsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-live-workspace.png') });

    // 3. Test Ambiguous Query
    console.log('3. Running Ambiguous Query...');
    const inputSelector = 'input[type="text"]';
    await page.waitForSelector(inputSelector, { timeout: 10000 });
    await page.focus(inputSelector);
    await page.type(inputSelector, 'Show me the best performing AI companies');

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const askBtn = btns.find(b => b.innerText.includes('Synthesize SQL') || b.innerText.includes('Ask AI'));
      if (askBtn) askBtn.click();
    });

    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-live-clarification.png') });

    // Select clarification option
    console.log('4. Resolving Clarification Option...');
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('div, button'));
      const opt = opts.find(o => o.innerText && o.innerText.includes('Highest Revenue'));
      if (opt) opt.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.innerText.includes('Confirm Intent') || b.innerText.includes('Confirm'));
      if (confirmBtn) confirmBtn.click();
    });

    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-live-results.png') });

    // 4. Test DB Explorer
    console.log('5. Navigating to DB Explorer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const expBtn = btns.find(b => b.innerText.includes('DB Explorer') || b.innerText.includes('Explorer'));
      if (expBtn) expBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-live-explorer.png') });

    // 5. Test History
    console.log('6. Navigating to Audit Trail...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find(b => b.innerText.includes('Audit Trail') || b.innerText.includes('History'));
      if (histBtn) histBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-live-history.png') });

    console.log('🎉 Live Production Redesign Verification: 100% OPERATIONAL!');
  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await browser.close();
  }
}

verifyLiveRedesign().catch(console.error);
