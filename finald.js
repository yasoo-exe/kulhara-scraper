const puppeteer = require("puppeteer");

async function getLinksOfCategories() {
  const browser = await puppeteer.launch({ headless: false });
  const homepage = await browser.newPage();
  await homepage.setRequestInterception(true);
  homepage.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await homepage.goto("https://www.daraz.pk/", {
    waitUntil: "networkidle0",
    timeout: 300000,
  });
  await homepage.waitForSelector(".lzd-site-menu-sub-item", {
    timeout: 300000,
  });

  const links = await homepage.$$eval(
    ".lzd-site-menu-sub-item",
    (categoryItems) => {
      return categoryItems.map((category) => {
        const url = category.querySelector("a").href;
        return { url, products: [] };
      });
    }
  );

  await browser.close();

  return links;
}

module.exports = { getLinksOfCategories };
