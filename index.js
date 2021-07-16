const { firefox } = require('playwright');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { google } = require("googleapis");


(async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.google.com/search?q=hotels');
  const content = await page.content();
  let dom = new JSDOM (content)
  Array.from(dom.window.document.querySelectorAll("[data-text-ad]")).map( ad =>
    console.log(ad.textContent) )
  // console.log(content.includes("data-text-ad"));

  await browser.close();
})();

(async () => {

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  
})
// console.log(dom)