const puppeteer = require("puppeteer");
const fs = require("fs");
const getCategories = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
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

  await page.goto("https://www.daraz.pk", {
    timeout: 0,
  });
  await page.waitForSelector(".lzd-site-menu-sub-item", { timeout: 0 });
  const categories = await page.$$eval(
    ".lzd-site-menu-sub-item",
    (categories) => {
      return categories.map((category) => {
        const title = category.querySelector("a span").textContent;
        const link = category.querySelector("a").href;
        return { title, link };
      });
    }
  );
  await browser.close();

  return categories; // Return the categories array
};

getCategories().then((categoriesLinks) =>
  // ... existing code ...

  getCategories().then((categoriesLinks) => {
    // Call productsFromCategoryScraper for each link in categoriesLinks
    const promises = categoriesLinks.map((category) =>
      productsFromCategoryScraper(category.link)
    );

    Promise.all(promises)
      .then((results) => {
        // Process the results here
        console.log(results);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  })
);

const productsFromCategoryScraper = async (categoryLink) => {
  const data = [];
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
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

  await page.goto(categoryLink, {
    timeout: 0,
    waitUntil: "networkidle0",
  });

  let hasNextPage = true;
  while (hasNextPage) {
    await page.waitForSelector(".gridItem--Yd0sa", { timeout: 0 });

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
      console.log("there is pagination");
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

  const jsonData = JSON.stringify(refinedData, null, 2);
  fs.writeFileSync("daraz_data.json", jsonData);
  console.log("Data has been written to daraz_data.json");
};
