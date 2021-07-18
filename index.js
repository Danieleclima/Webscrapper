const { firefox } = require("playwright");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { google } = require("googleapis");
const keyword = "shoes+for+men";
const today = new Date();
const date =
  today.getFullYear() +
  "-" +
  (today.getMonth() + 1) +
  "-" +
  today.getDate() +
  " " +
  today.getHours() +
  ":" +
  today.getMinutes();
  
// Please replace the value of the keyword variable with the keyword that you would like to search for.
// This function launches a headless browser in order to scrape Google SERP.
(async () => {
  console.log("launching browser");
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`https://www.google.com/search?q=${keyword}`);
  const content = await page.content();
  console.log("fetching ads from Google SERP");
  let dom = new JSDOM(content);
  let Ads = aggregateAds(dom);
  console.log("sending Ads to Google Sheets");
  sendAds(Ads);
  await browser.close();
})();

// fetching all text ads from the DOM
function selectTextAds(domObject) {
  let allTextAds = [];
  let type = "Text Ad";
  // iterating over a text ads list
  if (
    domObject.window.document
      .querySelector("*")
      .outerHTML.includes("data-text-ad")
  ) {
    console.log("creating an array of text ads");
    domObject.window.document
      .querySelectorAll("[data-text-ad]")
      .forEach((ad, index) => {        
        let position = index + 1;
        let headline = ad.querySelector("[role]").textContent;
        let description;
        if (ad.querySelector("em")) {
          description = ad.querySelector("em").parentElement.textContent;
        } else {
          description = ad.textContent;
        }
        let path = ad.querySelector("span:nth-child(2)").textContent;
        let newTextAd = [
          date,
          keyword,
          position,
          headline,
          description,
          path,
          type,
        ];
        allTextAds.push(newTextAd);
      });
  } else {
    let noAds = [
      date,
      keyword,
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      type,
      "No text ads",
    ];
    allTextAds.push(noAds);
  }
  return allTextAds;
}

// fetching all Shopping ads from the DOM
function selectShoppingAds(domObject) {
  let allShoppingAds = [];
  let type = "Shopping Ad";
  if (
    domObject.window.document
      .querySelector("*")
      .outerHTML.includes("top-pla-group-inner")
  ) {
    console.log("creating an array of shopping ads");
    let list = Array.from(
      domObject.window.document.querySelectorAll(".pla-unit-container")
    );
    list.pop();
    // Creating array of shopping ads
    list.forEach((ad, index) => {
      let position = index + 1;
      let headline = ad.querySelector(".pla-unit-title").textContent;
      let advertiser;
      if (ad.querySelectorAll("span")[2]) {
        advertiser = ad.querySelectorAll("span")[2].textContent;
      } else {
        advertiser = ad.textContent;
      }
      let newShoppingAd = [
        date,
        keyword,
        position,
        headline,
        "N/A",
        advertiser,
        type,
      ];
      allShoppingAds.push(newShoppingAd);
    });
  } else {
    let noAds = [
      date,
      keyword,
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      type,
      "No shopping ads",
    ];
    allShoppingAds.push(noAds);
  }
  return allShoppingAds;
}

function aggregateAds(domObject) {
  let allAds = selectTextAds(domObject);
  let shoppingAds = selectShoppingAds(domObject);
  shoppingAds.forEach((element) => {
    allAds.push(element);
  });
  return allAds;
}

async function sendAds(ads) {
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
  });
  console.log("Ads have been exported succesfully")
  console.log("closing browser")
}
