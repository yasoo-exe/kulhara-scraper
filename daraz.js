const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const darazHomepage = await browser.newPage();

  // Enable request interception
  await darazHomepage.setRequestInterception(true);

  // Intercept network requests
  darazHomepage.on("request", (request) => {
    if (request.resourceType() === "image") {
      // Abort image requests
      request.abort();
    } else {
      // Continue other requests
      request.continue();
    }
  });

  await darazHomepage.goto("https://www.daraz.pk/", { timeout: 0 });

  const links = await darazHomepage.$$eval(
    ".lzd-site-menu-sub-item > a",
    (categoryLinks) => {
      return categoryLinks.map((link) => link.href);
    }
  );

  JSON.stringify(links, null, 2);

  await browser.close();
})();
