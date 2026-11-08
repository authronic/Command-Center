const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('--- Phase 1 Automated Screenshot & E2E Validation ---');
  console.log('Connecting to Microsoft Edge at:', EDGE_PATH);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // 1. Unauthenticated test
    console.log('Step 1: Testing unauthenticated route protection on /dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    const currentUrl = page.url();
    console.log('Current URL after accessing /dashboard:', currentUrl);
    if (!currentUrl.includes('/login')) {
      throw new Error('FAILED: Unauthenticated request was not redirected to /login');
    }
    console.log('PASS: Unauthenticated redirect verified.');

    // 2. Desktop Login Screen (1440px)
    console.log('Step 2: Capturing Desktop Login Screen (1440x900)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login-desktop-1440.png'), fullPage: false });

    // 3. Mobile Login Screen (375px)
    console.log('Step 3: Capturing Mobile Login Screen (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-login-mobile-375.png'), fullPage: false });

    // 4. Perform Login
    console.log('Step 4: Performing authenticated sign in...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.type('#username-input', 'admin');
    await page.type('#password-input', 'authronic2026');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
      page.click('button[type="submit"]'),
    ]);
    console.log('Successfully navigated to:', page.url());

    // 5. Dashboard Desktop (1440px)
    console.log('Step 5: Capturing Dashboard Desktop (1440x900)...');
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-dashboard-desktop-1440.png'), fullPage: false });

    // 6. Dashboard Tablet (768px)
    console.log('Step 6: Capturing Dashboard Tablet (768x1024)...');
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-dashboard-tablet-768.png'), fullPage: false });

    // 7. Dashboard Mobile (375px)
    console.log('Step 7: Capturing Dashboard Mobile (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-dashboard-mobile-375.png'), fullPage: false });

    // 8. Mobile Drawer Open (375px)
    console.log('Step 8: Opening Mobile Navigation Drawer (375x812)...');
    await page.click('button[aria-label="Open navigation menu"]');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-mobile-drawer-open-375.png'), fullPage: false });

    // Close drawer
    await page.click('button[aria-label="Close navigation menu"]');
    await new Promise(r => setTimeout(r, 400));

    // 9. Desktop Command Palette (1440px)
    console.log('Step 9: Testing Command Palette (Ctrl+K)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-command-palette-1440.png'), fullPage: false });
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // 10. Notifications Dropdown
    console.log('Step 10: Capturing Notifications Dropdown...');
    await page.click('button[aria-label="Notifications"]');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-notifications-menu-1440.png'), fullPage: false });
    await page.click('button[aria-label="Notifications"]'); // close
    await new Promise(r => setTimeout(r, 400));

    // 11. Approvals Queue (1440px)
    console.log('Step 11: Capturing Approvals Page (1440x900)...');
    await page.goto('http://localhost:3000/approvals', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-approvals-desktop-1440.png'), fullPage: false });

    // 12. My Tasks (1440px)
    console.log('Step 12: Capturing Tasks Page (1440x900)...');
    await page.goto('http://localhost:3000/tasks', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-tasks-desktop-1440.png'), fullPage: false });

    // 13. Integrations (1440px)
    console.log('Step 13: Capturing Integrations Page (1440x900)...');
    await page.goto('http://localhost:3000/integrations', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-integrations-desktop-1440.png'), fullPage: false });

    console.log('--- ALL AUTOMATED E2E TESTS & SCREENSHOTS COMPLETED SUCCESSFULLY ---');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
