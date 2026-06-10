import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER CONSOLE ERROR:', msg.text());
      }
    });

    await page.goto('http://localhost:5173/journal', { waitUntil: 'networkidle2' });
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    if (bodyHTML.includes('id="root"></div>')) {
      console.log("PAGE IS BLANK");
    } else {
      console.log("PAGE RENDERED SUCCESSFULLY.");
    }
    
    await browser.close();
  } catch (err) {
    console.error('Puppeteer Script Error:', err);
  }
})();
