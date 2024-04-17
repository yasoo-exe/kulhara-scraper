const puppeteer = require("puppeteer");
const fs = require("fs");

console.time("Execution Time");

(async () => {
  const data = [];
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0, // Set timeout to zero
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true, { timeout: 0 });
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(`https://www.daraz.pk/baseballs/`, {
    timeout: 0, // Set timeout to zero
    waitUntil: "networkidle0", // Wait until there are no more than 0 network connections
  });

  let hasNextPage = true;
  while (hasNextPage) {
    await page.waitForSelector(".gridItem--Yd0sa", { timeout: 0 });
    console.log("Selector found");

    const products = await page.$$eval(".gridItem--Yd0sa", (products) => {
      return products.map((product) => {
        const title = product.querySelector(".title-wrapper--IaQ0m").innerText;
        const link = product.querySelector("#id-a-link").href;
        return { title, link };
      });
    });

    data.push(...products);

    const pagination = await page.$(".ant-pagination");

    if (pagination) {
      const lastPaginationItem = await pagination.$("li.ant-pagination-next a");
      const isLastItemDisabled = await pagination.$eval(
        "li.ant-pagination-next",
        (item) => item.getAttribute("aria-disabled") === "true"
      );

      if (isLastItemDisabled) {
        hasNextPage = false;
      } else {
        const lastPaginationItemHandle =
          await lastPaginationItem.evaluateHandle((node) => node);
        await lastPaginationItemHandle.click();
        await page.waitForSelector(".gridItem--Yd0sa", { timeout: 0 });
        await lastPaginationItemHandle.dispose();
      }
    } else {
      hasNextPage = false;
    }
  }

  await browser.close();

  const refinedData = data.filter((item, index, self) => {
    return index === self.findIndex((t) => t.link === item.link);
  });

  console.log("Total products scraped:", refinedData.length);

  const jsonData = JSON.stringify(refinedData, null, 2);
  fs.writeFileSync("daraz_data.json", jsonData);

  console.timeEnd("Execution Time");
})();
