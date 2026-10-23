const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:4173/';
const SCREENSHOT_DIR = path.join(__dirname, 'royal-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runRoyalCheck() {
  console.log('👑 Testing Royal Navy & Gold Theme with Transparent Boxes on ' + TARGET_URL);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('❌ Console Error:', msg.text());
    }
  });

  try {
    // 1. Landing Page with Transparent Console
    console.log('1. Capturing Landing Page with Transparent Console Window...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-royal-landing-hero.png') });

    // Scroll slightly down to focus directly on the transparent preview console (Image 2)
    await page.evaluate(() => window.scrollBy(0, 450));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-royal-transparent-console.png') });

    // 2. Query Workspace
    console.log('2. Navigating to Query Workspace Console...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wsBtn = btns.find(b => b.innerText.includes('Query Console') || b.innerText.includes('Launch Query Console'));
      if (wsBtn) wsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-royal-workspace.png') });

    // 3. Ambiguous Query & Clarification Modal
    console.log('3. Triggering Ambiguous Query for Clarification Modal...');
    const inputSelector = 'input[type="text"]';
    await page.waitForSelector(inputSelector);
    await page.click(inputSelector);
    await page.type(inputSelector, 'Show me the top performing AI companies in 2024');
    await page.keyboard.press('Enter');

    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-royal-clarification-modal.png') });

    // 4. Resolve Disambiguation
    console.log('4. Resolving Disambiguation...');
    await page.evaluate(() => {
      const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Confirm Intent') || b.innerText.includes('Confirm Disambiguation'));
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-royal-resolved-sql.png') });

    // 5. DB Explorer
    console.log('5. Navigating to Database Explorer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const expBtn = btns.find(b => b.innerText.includes('DB Explorer') || b.innerText.includes('Explore Schema'));
      if (expBtn) expBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-royal-db-explorer.png') });

    // Switch to ERD Topology
    await page.evaluate(() => {
      const erdBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Entity Relationship Map') || b.innerText.includes('ERD'));
      if (erdBtn) erdBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-royal-erd-topology.png') });

    // 6. Audit Trail
    console.log('6. Navigating to Audit Trail...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find(b => b.innerText.includes('Audit Trail') || b.innerText.includes('History'));
      if (histBtn) histBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-royal-audit-trail.png') });

    console.log('✨ All Royal Theme screenshots captured successfully!');
  } catch (err) {
    console.error('Test Execution Error:', err);
  } finally {
    await browser.close();
  }
}

runRoyalCheck();
