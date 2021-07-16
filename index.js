const { firefox } = require('playwright');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { google } = require("googleapis");
const keyword = "hotels";

(async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`https://www.google.com/search?q=${keyword}`);
  const content = await page.content();
  let dom = new JSDOM (content)
  let scrappedAds = SelectAds(dom)
  sendAds(scrappedAds)
  await browser.close();
})();

// taking a domObject and converting it into an array of ads
function SelectAds (domObject) {
  //  console.log(domObject)
   let allAds = []
   let today = new Date();
   let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+ ' ' + today.getHours() + ":" + today.getMinutes();
  // iterating over an ad list
  if (domObject.window.document.querySelector("*").outerHTML.includes("data-text-ad")){
  domObject.window.document.querySelectorAll("[data-text-ad]").forEach( (ad, index) =>{
    let position = index + 1;
    let headline = ad.querySelector("[role]").textContent;
    let div = ad.children;
    console.log(div[0])
    let description = div[0].children[1].querySelector("span").textContent ||= "No description";
    let path = ad.querySelector("span:nth-child(2)").textContent;
    let newAd = [date, keyword, position, headline, description, path];
    allAds.push(newAd);
    // sendAds(ad.textContent)
  })
    
} else if (domObject.window.document.querySelector("*").outerHTML.includes(".top-pla-group-inner")) {
  domObject.window.document.querySelectorAll(".top-pla-group-inner").forEach( (ad, index) =>{
    let position = index + 1;
    let headline = ad.querySelector("[role]").textContent;
    let div = ad.children;
    console.log(div[0])
    let description = div[0].children[1].querySelector("span").textContent ||= "No description";
    let path = ad.querySelector("span:nth-child(2)").textContent;
    let newAd = [date, keyword, position, headline, description, path];
    allAds.push(newAd);
    // sendAds(ad.textContent)
  })
}

else {
    let noAds = [date, keyword, "N/A", "N/A", "N/A", "N/A"]
    allAds.push(noAds)
}
return allAds
}

async function sendAds (ads) {

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
        values: ads,
      },
    })

}
