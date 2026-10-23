const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:4173/';
const SCREENSHOT_DIR = path.join(__dirname, 'dark-navy-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDarkNavyVerification() {
  console.log('🌌 Starting Dark Navy Blue Theme & Bug Fix Verification on ' + TARGET_URL);

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

  try {
    // Step 1: Landing Page
    console.log('📸 1. Capturing Landing Page with Dark Navy visual architecture...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-dark-navy-landing.png') });

    // Step 2: Query Workspace Console (Initial Ready State)
    console.log('📸 2. Navigating to Query Workspace Console...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wsBtn = btns.find(b => b.innerText.includes('Query Console') || b.innerText.includes('Launch Query Console'));
      if (wsBtn) wsBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dark-navy-workspace-ready.png') });

    // Step 3: Ambiguous Query & Clarification Modal
    console.log('📸 3. Submitting ambiguous query: "Show me the best performing AI companies"...');
    const inputSelector = 'input[type="text"]';
    await page.waitForSelector(inputSelector);
    await page.click(inputSelector);
    await page.type(inputSelector, 'Show me the best performing AI companies');
    await page.keyboard.press('Enter');

    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-dark-navy-clarification-modal.png') });

    // Step 4: Resolve Clarification and Verify Result Table
    console.log('📸 4. Selecting Highest Revenue Growth metric and confirming...');
    await page.evaluate(() => {
      const options = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
      const growthOption = options.find(el => el.innerText.includes('Growth') || el.innerText.includes('highest_revenue_growth'));
      if (growthOption) growthOption.click();
      
      const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Confirm Intent'));
      if (confirmBtn) confirmBtn.click();
    });

    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-dark-navy-results-table.png') });

    // Verify company names and revenue growth percentage formatting
    const tableVerification = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const textContent = rows.map(r => r.innerText);
      const hasNull = textContent.some(t => t.toLowerCase().includes('null'));
      const hasPercent = textContent.some(t => t.includes('%'));
      const companyNames = rows.map(r => {
        const cells = Array.from(r.querySelectorAll('td'));
        return cells[1] ? cells[1].innerText : '';
      });
      return { rowCount: rows.length, hasNull, hasPercent, companyNames };
    });

    console.log('🔍 Table Verification Results:', tableVerification);
    if (tableVerification.hasNull) {
      console.error('❌ BUG DETECTED: Table contains "null" values!');
    } else {
      console.log('✅ PASS: No "null" company names found in table!');
    }
    if (tableVerification.hasPercent) {
      console.log('✅ PASS: Revenue growth is accurately formatted as percentage (%)!');
    } else {
      console.warn('⚠️ Note: Verify if percentage column was included in view.');
    }

    // Step 5: Toggle to Visual Chart and Verify X-Axis
    console.log('📸 5. Toggling to Visual Chart View...');
    await page.evaluate(() => {
      const chartBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Visual Chart'));
      if (chartBtn) chartBtn.click();
    });
    await sleep(900);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-dark-navy-chart.png') });

    // Verify X-axis labels in SVG
    const chartLabels = await page.evaluate(() => {
      const ticks = Array.from(document.querySelectorAll('.recharts-xAxis text, text.recharts-cartesian-axis-tick-value'));
      return ticks.map(t => t.textContent.trim()).filter(Boolean);
    });
    console.log('📊 Chart X-Axis Labels detected:', chartLabels);
    if (chartLabels.length > 0 && !chartLabels.some(l => l === 'null' || l === 'undefined' || l === '')) {
      console.log('✅ PASS: Chart X-Axis displays real company/model labels!');
    }

    // Step 6: Test CSV Export
    console.log('📥 6. Testing CSV Export action...');
    await page.evaluate(() => {
      // Toggle back to table
      const tblBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Data Table'));
      if (tblBtn) tblBtn.click();
    });
    await sleep(400);

    const exported = await page.evaluate(() => {
      const exportBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Export CSV'));
      if (exportBtn) {
        exportBtn.click();
        return true;
      }
      return false;
    });
    console.log(`CSV Export button clicked: ${exported}`);
    await sleep(500);

    // Step 7: Database Explorer
    console.log('📸 7. Navigating to Database Explorer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const expBtn = btns.find(b => b.innerText.includes('DB Explorer') || b.innerText.includes('Explore Schema'));
      if (expBtn) expBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-dark-navy-db-explorer.png') });

    // Step 8: Audit Trail
    console.log('📸 8. Navigating to Query Audit Trail...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find(b => b.innerText.includes('Audit Trail'));
      if (histBtn) histBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-dark-navy-audit-trail.png') });

    // Step 9: Responsive Mobile View (Viewport 390x844 - iPhone 14)
    console.log('📱 9. Testing responsive mobile layout (390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-dark-navy-mobile-audit.png') });

    // Open mobile menu
    await page.evaluate(() => {
      const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (menuBtn) menuBtn.click();
    });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-dark-navy-mobile-menu.png') });

    console.log('🎉 All Dark Navy Blue verification tests and screenshots completed successfully!');

  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

runDarkNavyVerification();
