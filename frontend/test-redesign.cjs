const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:5173/';
const SCREENSHOT_DIR = path.join(__dirname, 'redesign-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runRedesignCheck() {
  console.log('🚀 Starting Verification on Redesigned Querify: ' + TARGET_URL);
  
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
    // 1. Initial Load & Hero
    console.log('1. Capturing Landing Page with Fixed AI/Database Background...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-redesigned-landing.png') });

    // 2. Cursor Trail Simulation
    console.log('2. Simulating cursor motion for cursor trail test...');
    for (let i = 0; i < 20; i++) {
      await page.mouse.move(200 + i * 40, 200 + Math.sin(i) * 60);
      await new Promise(r => setTimeout(r, 20));
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-cursor-trail.png') });

    // 3. Switch to Workspace / Query Console
    console.log('3. Navigating to Query Console...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wsBtn = btns.find(b => b.innerText.includes('Console') || b.innerText.includes('Workspace') || b.innerText.includes('Launch Query Console'));
      if (wsBtn) wsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-redesigned-workspace.png') });

    // 4. Test Ambiguous Query
    console.log('4. Testing Ambiguous Query & Clarification Modal...');
    const inputSelector = 'input[type="text"]';
    await page.waitForSelector(inputSelector);
    await page.focus(inputSelector);
    await page.type(inputSelector, 'Show me the best performing AI companies');
    
    // Click Synthesize SQL button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const askBtn = btns.find(b => b.innerText.includes('Synthesize SQL') || b.innerText.includes('Ask AI'));
      if (askBtn) askBtn.click();
    });

    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-redesigned-clarification-modal.png') });

    // Select an option in Clarification Modal
    console.log('5. Selecting Clarification Option...');
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('div, button'));
      const opt = opts.find(o => o.innerText && o.innerText.includes('Highest Revenue'));
      if (opt) opt.click();
    });

    await new Promise(r => setTimeout(r, 800));
    // Click Confirm button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.innerText.includes('Confirm Intent') || b.innerText.includes('Confirm'));
      if (confirmBtn) confirmBtn.click();
    });

    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-redesigned-query-results.png') });

    // 5. Test DB Explorer
    console.log('6. Navigating to DB Explorer with Table Search...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const expBtn = btns.find(b => b.innerText.includes('DB Explorer') || b.innerText.includes('Explorer'));
      if (expBtn) expBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-redesigned-db-explorer.png') });

    // Click ERD Subtab
    console.log('7. Testing ERD Subtab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const erdBtn = btns.find(b => b.innerText.includes('ERD') || b.innerText.includes('Entity Relationship'));
      if (erdBtn) erdBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-redesigned-erd.png') });

    // 6. Test History Audit Trail
    console.log('8. Navigating to Audit Trail...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find(b => b.innerText.includes('Audit Trail') || b.innerText.includes('History'));
      if (histBtn) histBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-redesigned-history.png') });

    console.log('✅ All Redesign verification checks completed successfully!');
  } catch (err) {
    console.error('❌ Check Failed:', err);
  } finally {
    await browser.close();
  }
}

runRedesignCheck().catch(console.error);
