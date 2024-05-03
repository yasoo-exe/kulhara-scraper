const puppeteer = require("puppeteer");
const fs = require("fs");

const scrapeCategories = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.daraz.pk/", {
    timeout: 0,
  });
  await page.waitForSelector(".lzd-site-menu-sub-item", { timeout: 0 });
  const categoryLinks = await page.$$eval(
    ".lzd-site-menu-sub-item",
    (categoryItems) => {
      return categoryItems.map((category) => {
        const link = category.querySelector("a").href;
        return { link, products: [] };
      });
    }
  );
  await browser.close();
  return categoryLinks;
};

const individualLinks = async (categoryLinks) => {
  const browser = await puppeteer.launch({ headless: false });
  const categoriesObj = [...categoryLinks];

  for (let i = 0; i < categoriesObj.length; i++) {
    const productsPage = await browser.newPage();
    await productsPage.goto(`${categoriesObj[i].link}`, {
      timeout: 0,
    });

    let hasNextPage = true;

    while (hasNextPage) {
      await productsPage.waitForSelector(".gridItem--Yd0sa", {
        timeout: 500,
      });
      console.log("found the selector!");

      const productsPerCategory = await productsPage.$$eval(
        ".gridItem--Yd0sa",
        (items) => {
          return items.map((item) => {
            const title = item.querySelector(".title-wrapper--IaQ0m").innerText;
            const link = item.querySelector("#id-a-link").href;
            console.log("found products");
            return { title, link };
          });
        }
      );
      categoriesObj[i].products.push(...productsPerCategory);
      console.log("pushed products!");

      const pagination = await page.$(".ant-pagination");

      if (pagination) {
        console.log("there is pagination");
        const lastPaginationItem = await pagination.$(
          "li.ant-pagination-next a"
        );
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
    await productsPage.close();
  }
  console.log(categoriesObj);
  const jsonString = JSON.stringify(categoriesObj);
  fs.writeFile("daddydaraz.json", jsonString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Data saved to data.json");
    }
  });
  console.log("data has been written to daddydaraz.json");
};

scrapeCategories().then((returnedCategories) =>
  individualLinks(returnedCategories)
);
