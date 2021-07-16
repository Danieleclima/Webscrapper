const { firefox } = require('playwright');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { google } = require("googleapis");


(async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  let keyword = "hair+transplant"
  await page.goto(`https://www.google.com/search?q=${keyword}`);
  const content = await page.content();
  let dom = new JSDOM (content)
  SelectAds(dom)
  // Array.from(dom.window.document.querySelectorAll("[data-text-ad]")).map( ad =>
  //   // console.log(ad.textContent),
  //   SendAds(ad.textContent)
  //   )
    
  // console.log(content.includes("data-text-ad"));

  await browser.close();
})();

function SelectAds (DomObject) {
  //  console.log(DomObject)
   let allAds = []
  DomObject.window.document.querySelectorAll("[data-text-ad]").forEach( ad =>{
    let newAd = []
    let date = Date.prototype.getDate()
    let Headline = ad.querySelector("[role]").textContent
    console.log(Headline)
    // SendAds(ad.textContent)
  })
}

async function SendAds (ads) {

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1eQpKSozTwm1KhpexY8rNTweSeTscADqbCsSKTdHIUks";

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[ads]],
      },
    })

}
