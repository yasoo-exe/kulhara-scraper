const puppeteer = require("puppeteer");
const fs = require("fs");

console.time("Execution Time");

(async () => {
  const priceOyeProducts = [];

  const browser = await puppeteer.launch({
    timeout: 0,
    headless: false, // Set headless mode to false for browser visibility
    defaultViewport: null, // Set viewport to null for full page rendering
    args: [
      "--no-sandbox", // Disable sandbox mode
      "--disable-setuid-sandbox", // Disable setuid sandbox mode
      "--disable-dev-shm-usage", // Disable /dev/shm usage
      "--disable-accelerated-2d-canvas", // Disable hardware acceleration
      "--disable-gpu", // Disable GPU acceleration
    ],
  });

  const homepage = await browser.newPage();

  // Disable image loading
  await homepage.setRequestInterception(true);
  homepage.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "script" ||
      request.resourceType() === "font"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  console.log("Connecting to the link...");
  await homepage.goto("https://www.priceoye.pk", { timeout: 0 });
  console.log("Connected to the link.");

  const links = await homepage.$$eval(".all-cat-icon a", (elements) =>
    elements.map((element) => element.href)
  );

  console.log("Found links:", links);

  for (const link of links) {
    const categoryPage = await browser.newPage();

    // Disable image loading
    await categoryPage.setRequestInterception(true);
    categoryPage.on("request", (request) => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        // request.resourceType() === "script" ||
        request.resourceType() === "font"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log(`Connecting to ${link}...`);
    await categoryPage.goto(link, { timeout: 0 });
    console.log(`Connected to ${link}.`);

    let hasNextPage = true;
    while (hasNextPage) {
      const products = await categoryPage.$$eval(
        ".productBox.b-productBox",
        (elements) =>
          elements.map((element) => {
            const productLink = element.querySelector("a").href;
            const title = element.querySelector(".p-title").textContent.trim();
            const price = element
              .querySelector(".price-box")
              .textContent.trim()
              .replace("Rs", "")
              .trim();

            return {
              title,
              price,
              productLink,
            };
          })
      );

      priceOyeProducts.push(...products);

      console.log("Scraped products:", products);

      const pagination = await categoryPage.$(".pagination");
      if (pagination) {
        const lastPageLink = await pagination.$(".pagination a:last-child");
        const isLastPageDisabled = await lastPageLink.evaluate((element) =>
          element.classList.contains("disabled")
        );

        if (isLastPageDisabled) {
          hasNextPage = false;
        } else {
          await lastPageLink.click();
          await categoryPage.waitForNavigation({ timeout: 0 });
        }
      } else {
        hasNextPage = false;
      }
    }
  }

  console.log("Scraped products:", priceOyeProducts);
  console.log("Total products scraped:", priceOyeProducts.length);

  await browser.close();

  const jsonData = JSON.stringify(priceOyeProducts, null, 2);
  fs.writeFileSync("priceOye_data.json", jsonData);

  console.timeEnd("Execution Time");
})();
