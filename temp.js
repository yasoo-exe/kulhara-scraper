const puppeteer = require("puppeteer");
const fs = require("fs");

const scrapeYears = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.scrapethissite.com/pages/forms/", {
    timeout: 0,
  });
  await page.waitForSelector(".pagination", { timeout: 0 });
  const paginationLinks = await page.$$eval(".pagination li", (listItems) => {
    return listItems.map((item) => {
      const link = item.querySelector("a").href;
      return link;
    });
  });
  //   console.log(paginationLinks);
  await browser.close();
  return paginationLinks;
};

const individualLinks = async (paginationLinks) => {
  const browser = await puppeteer.launch({ headless: false });
  const teams = [];

  for (let i = 0; i < paginationLinks.length; i++) {
    const linkPage = await browser.newPage();
    await linkPage.goto(paginationLinks[i], {
      timeout: 0,
      waitUntil: "networkidle0",
    });
    await linkPage.waitForSelector(".table", { timeout: 0 });
    const statsPerTeam = await linkPage.$$eval(".team", (teams) => {
      return teams.map((team) => {
        const name = team.querySelector(".name").textContent.trim();
        const year = team.querySelector(".year").textContent.trim();
        const wins = team.querySelector(".wins").textContent.trim();
        const losses = team.querySelector(".losses").textContent.trim();
        return { name, year, wins, losses };
      });
    });
    teams.push(statsPerTeam);
    await linkPage.close();
  }

  console.log(teams);
  console.log(teams.length);
  const jsonString = JSON.stringify(teams);
  fs.writeFile("data.json", jsonString);

  await browser.close();
};

scrapeYears().then((returnedLinks) => individualLinks([returnedLinks]));
