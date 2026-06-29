import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://tfg.metaverse911.in/', { waitUntil: 'networkidle0' });
  
  // Extract text from the page
  const text = await page.evaluate(() => document.body.innerText);
  console.log('--- PAGE TEXT ---');
  console.log(text);
  
  // Also dump HTML structure for layout hints
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('--- PAGE HTML ---');
  console.log(html.substring(0, 5000)); // Just the first part for structure

  await browser.close();
})();
