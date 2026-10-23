const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://querify-nine.vercel.app/';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runFullSiteCheck() {
  console.log('🚀 Starting Comprehensive Live Site Check on ' + TARGET_URL);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      console.error('❌ Browser Console Error:', text);
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
    console.error('💥 Uncaught Page Error:', err.toString());
  });

  const results = {
    loadPage: false,
    landingPage: false,
    workspaceAmbiguousQuery: false,
    clarificationModal: false,
    clarificationResolution: false,
    unambiguousQuery: false,
    dbExplorerSchemas: false,
    dbExplorerSampleData: false,
    historyPageAuditLogs: false,
    aboutPage: false,
    errorsFound: []
  };

  try {
    // 1. Initial Page Load
    console.log('\n--- 1. Testing Page Load ---');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-initial-load.png') });
    
    const title = await page.title();
    console.log(`Page Title: "${title}"`);
    results.loadPage = title.includes('Querify');

    // Check if landing hero exists
    const heroText = await page.evaluate(() => document.body.innerText);
    results.landingPage = heroText.includes('Ask in English') || heroText.includes('Querify') || heroText.includes('Text-to-SQL');
    console.log(`Landing Page Content Present: ${results.landingPage}`);

    // 2. Test Navigation to Workspace / Query
    console.log('\n--- 2. Testing Query & Clarification Engine ---');
    // Find button/tab to enter Workspace (could be "Launch Workspace", "Get Started", or "Query" tab in Navbar)
    const navButtons = await page.$$('button, a');
    let clickedWorkspace = false;
    for (const btn of navButtons) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text.includes('Workspace') || text.includes('Launch Workspace') || text.includes('Query') || text.includes('Try Query')) {
        await btn.click();
        clickedWorkspace = true;
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-workspace-tab.png') });

    // Find Query Input textarea or input
    const inputSelector = 'textarea, input[type="text"]';
    await page.waitForSelector(inputSelector, { timeout: 5000 });
    
    // Type ambiguous query
    const ambiguousQuery = "Show me the top performing AI companies";
    console.log(`Typing ambiguous English query: "${ambiguousQuery}"`);
    await page.focus(inputSelector);
    // Clear input
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(inputSelector, ambiguousQuery);
    
    // Click submit button (looks for Analyze, Ask, Run, or Submit)
    const submitBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Analyze') || b.innerText.includes('Run') || b.innerText.includes('Ask') || b.innerText.includes('Generate') || b.innerText.includes('Search')) || btns.find(b => b.type === 'submit');
    });

    if (submitBtn) {
      await submitBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }

    console.log('Submitted ambiguous query. Waiting for Clarification Modal...');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-clarification-triggered.png') });

    // Check if clarification modal appeared
    const modalText = await page.evaluate(() => document.body.innerText);
    const hasClarification = modalText.includes('Clarification') || modalText.includes('What metric') || modalText.includes('Net Profit') || modalText.includes('Select an option') || modalText.includes('Ambiguity');
    console.log(`Clarification Modal Detected: ${hasClarification}`);
    results.clarificationModal = hasClarification;

    if (hasClarification) {
      // Click one of the clarification choices (e.g. Net Profit Margin or Annual Revenue)
      const optionClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const opt = buttons.find(b => b.innerText.includes('Profit') || b.innerText.includes('Revenue') || b.innerText.includes('Market Cap'));
        if (opt) {
          opt.click();
          return opt.innerText;
        }
        return null;
      });
      console.log(`Clicked Clarification Option: "${optionClicked}"`);
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-clarification-resolved.png') });

      // Verify SQL and Results appeared
      const postClarifyText = await page.evaluate(() => document.body.innerText);
      const hasSql = postClarifyText.includes('SELECT') || postClarifyText.includes('FROM');
      const hasTable = postClarifyText.includes('company_name') || postClarifyText.includes('annual_revenue') || postClarifyText.includes('Rows');
      console.log(`SQL Generated: ${hasSql}, Results Rendered: ${hasTable}`);
      results.clarificationResolution = hasSql || hasTable;
    }

    // 3. Test Unambiguous Query
    console.log('\n--- 3. Testing Unambiguous Query ---');
    const unambiguousQuery = "Show all AI models released in 2024";
    console.log(`Typing unambiguous English query: "${unambiguousQuery}"`);
    await page.focus(inputSelector);
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(inputSelector, unambiguousQuery);

    const submitBtn2 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Analyze') || b.innerText.includes('Run') || b.innerText.includes('Ask') || b.innerText.includes('Generate') || b.innerText.includes('Search')) || btns.find(b => b.type === 'submit');
    });
    if (submitBtn2) await submitBtn2.click(); else await page.keyboard.press('Enter');

    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-unambiguous-results.png') });
    const postUnambiguousText = await page.evaluate(() => document.body.innerText);
    results.unambiguousQuery = postUnambiguousText.includes('SELECT') || postUnambiguousText.includes('GPT-4') || postUnambiguousText.includes('Gemini') || postUnambiguousText.includes('Claude');
    console.log(`Unambiguous Query Result Verified: ${results.unambiguousQuery}`);

    // 4. Test Database Explorer Tab
    console.log('\n--- 4. Testing DB Explorer Tab ---');
    const clickedExplorer = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const exp = links.find(l => l.innerText.includes('DB Explorer') || l.innerText.includes('Database') || l.innerText.includes('Explorer'));
      if (exp) {
        exp.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked DB Explorer Tab: ${clickedExplorer}`);
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-db-explorer-tab.png') });

    const explorerContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return {
        hasEcommerce: body.includes('ecommerce') || body.includes('E-Commerce') || body.includes('products'),
        hasSaas: body.includes('saas') || body.includes('SaaS') || body.includes('tenants'),
        hasHr: body.includes('hr') || body.includes('HR') || body.includes('employees'),
        hasFintech: body.includes('fintech') || body.includes('FinTech') || body.includes('accounts'),
        isDarkBlank: body.trim().length === 0
      };
    });
    console.log('DB Explorer Schemas Detected:', explorerContent);
    results.dbExplorerSchemas = !explorerContent.isDarkBlank && (explorerContent.hasEcommerce || explorerContent.hasSaas);

    // Click a table to inspect sample data
    console.log('Testing table sample data inspection in DB Explorer...');
    const tableClicked = await page.evaluate(() => {
      const tableItems = Array.from(document.querySelectorAll('button, div[role="button"], tr, h4, h3'));
      const tbl = tableItems.find(t => t.innerText.includes('products') || t.innerText.includes('customers') || t.innerText.includes('orders') || t.innerText.includes('companies'));
      if (tbl) {
        tbl.click();
        return tbl.innerText;
      }
      return null;
    });
    console.log(`Clicked table: "${tableClicked}"`);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-db-explorer-table-selected.png') });

    const sampleDataText = await page.evaluate(() => document.body.innerText);
    results.dbExplorerSampleData = sampleDataText.includes('Sample') || sampleDataText.includes('Columns') || sampleDataText.includes('Type') || sampleDataText.includes('INT') || sampleDataText.includes('VARCHAR');
    console.log(`Sample Data / Column Schema Verified: ${results.dbExplorerSampleData}`);

    // 5. Test History Tab
    console.log('\n--- 5. Testing History Tab ---');
    const clickedHistory = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const hist = links.find(l => l.innerText.includes('History') || l.innerText.includes('Audit'));
      if (hist) {
        hist.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked History Tab: ${clickedHistory}`);
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-history-tab.png') });

    const historyContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return {
        hasQueries: body.includes('SELECT') || body.includes('performing') || body.includes('revenue') || body.includes('SUCCESS') || body.includes('ms'),
        hasEmptyState: body.includes('No queries yet') || body.includes('Query History'),
        isDarkBlank: body.trim().length === 0
      };
    });
    console.log('History Tab Content Detected:', historyContent);
    results.historyPageAuditLogs = !historyContent.isDarkBlank && (historyContent.hasQueries || historyContent.hasEmptyState);

    // 6. Test About Tab
    console.log('\n--- 6. Testing About Tab ---');
    const clickedAbout = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const ab = links.find(l => l.innerText.includes('About') || l.innerText.includes('Architecture'));
      if (ab) {
        ab.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked About Tab: ${clickedAbout}`);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-about-tab.png') });

    const aboutContent = await page.evaluate(() => document.body.innerText);
    results.aboutPage = aboutContent.includes('Architecture') || aboutContent.includes('Clarification') || aboutContent.includes('Pipeline') || aboutContent.includes('Viva');
    console.log(`About Page Content Verified: ${results.aboutPage}`);

  } catch (err) {
    console.error('Test Execution Error:', err);
    results.errorsFound.push(err.message);
  } finally {
    await browser.close();
  }

  results.pageErrors = pageErrors;
  results.consoleErrorCount = consoleLogs.filter(l => l.startsWith('[error]')).length;

  console.log('\n====================================');
  console.log('🏁 FULL SITE VERIFICATION RESULTS:');
  console.log(JSON.stringify(results, null, 2));
  console.log('====================================\n');
}

runFullSiteCheck().catch(err => {
  console.error('Fatal Runner Exception:', err);
  process.exit(1);
});
