const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE EXCEPTION:', err.toString()));
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  const html = await page.$eval('#root', el => el.innerHTML);
  console.log('ROOT HTML LENGTH:', html.length);
  if (html.length < 500) console.log('ROOT HTML:', html);
  await browser.close();
})();
