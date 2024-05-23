const { default: puppeteer } = require("puppeteer");
const { getLinksOfCategories } = require("./finald.js");
const fs = require("fs");

const links = [
  { url: "https://www.daraz.pk/buy-fresh-produce/", products: [] },
  { url: "https://www.daraz.pk/breakfast/", products: [] },
  { url: "https://www.daraz.pk/beverages/", products: [] },
  {
    url: "https://www.daraz.pk/baking-and-cooking/?spm=a2a0e.searchlistcategory.breadcrumb.3.6d477e97xGB0Py",
    products: [],
  },
  { url: "https://www.daraz.pk/laundry-and-home-care-4/", products: [] },
  { url: "https://www.daraz.pk/groceries-frozen/", products: [] },
  { url: "https://www.daraz.pk/cats-supplies/", products: [] },
  { url: "https://www.daraz.pk/dogs-supplies/", products: [] },
  { url: "https://www.daraz.pk/pet-supplies-fish/", products: [] },
  { url: "https://www.daraz.pk/womens-make-up/", products: [] },
  { url: "https://www.daraz.pk/health-beauty-tools/", products: [] },
  { url: "https://www.daraz.pk/skincare/", products: [] },
  { url: "https://www.daraz.pk/hair-care/", products: [] },
  { url: "https://www.daraz.pk/bath-body/", products: [] },
  { url: "https://www.daraz.pk/mens-grooming/", products: [] },
  { url: "https://www.daraz.pk/personal-care/", products: [] },
  { url: "https://www.daraz.pk/fragrances/", products: [] },
  { url: "https://www.daraz.pk/sexual-wellness/", products: [] },
  { url: "https://www.daraz.pk/health-beauty-care/", products: [] },
  { url: "https://www.daraz.pk/mens-t-shirts/", products: [] },
  { url: "https://www.daraz.pk/mens-shirts/", products: [] },
  { url: "https://www.daraz.pk/mens-pants-trousers/", products: [] },
  { url: "https://www.daraz.pk/mens-shorts/", products: [] },
  { url: "https://www.daraz.pk/mens-traditional-clothing/", products: [] },
  { url: "https://www.daraz.pk/men-sweaters-cardigans/", products: [] },
  { url: "https://www.daraz.pk/clothing-men-underwear/", products: [] },
  { url: "https://www.daraz.pk/mens-shoes/", products: [] },
  { url: "https://www.daraz.pk/men-accessories/", products: [] },
  { url: "https://www.daraz.pk/boys-clothing/", products: [] },
  { url: "https://www.daraz.pk/fashion-boys-accessories/", products: [] },
  { url: "https://www.daraz.pk/womens-lawn/", products: [] },
  {
    url: "https://www.daraz.pk/womens-kurtas-shalwar-kameez/",
    products: [],
  },
  { url: "https://www.daraz.pk/womens-abayas-and-hijabs/", products: [] },
  { url: "https://www.daraz.pk/tops/", products: [] },
  { url: "https://www.daraz.pk/womens-lingerie-sleepwear/", products: [] },
  { url: "https://www.daraz.pk/womens-nightwear/", products: [] },
  { url: "https://www.daraz.pk/womens-pants-trousers/", products: [] },
  { url: "https://www.daraz.pk/womens-dresses/", products: [] },
  { url: "https://www.daraz.pk/womens-sweaters/", products: [] },
  { url: "https://www.daraz.pk/womens-shoes/", products: [] },
  { url: "https://www.daraz.pk/girls-clothing/", products: [] },
  { url: "https://www.daraz.pk/formula-milk/", products: [] },
  {
    url: "https://www.daraz.pk/baby-toddler-diapers-potties/",
    products: [],
  },
  { url: "https://www.daraz.pk/feeding/", products: [] },
  {
    url: "https://www.daraz.pk/womens-maternity-care/?spm=a2a0e.pdp.breadcrumb.2.3d0fx8JXx8JXJO",
    products: [],
  },
  { url: "https://www.daraz.pk/baby-gear/", products: [] },
  { url: "https://www.daraz.pk/baby-toddler-nursery/", products: [] },
  { url: "https://www.daraz.pk/baby-personal-care/", products: [] },
  { url: "https://www.daraz.pk/baby-clothings-accessories/", products: [] },
  { url: "https://www.daraz.pk/baby-toddler-toys-games/", products: [] },
  {
    url: "https://www.daraz.pk/remote-control-toys-and-play-vehicles/",
    products: [],
  },
  { url: "https://www.daraz.pk/sports-and-outdoor-play/", products: [] },
  { url: "https://www.daraz.pk/toys-games/", products: [] },
  { url: "https://www.daraz.pk/bath/", products: [] },
  { url: "https://www.daraz.pk/bedding-2/", products: [] },
  { url: "https://www.daraz.pk/home-decoration/", products: [] },
  { url: "https://www.daraz.pk/furniture/", products: [] },
  { url: "https://www.daraz.pk/kitchen-dining/", products: [] },
  { url: "https://www.daraz.pk/lighting/", products: [] },
  { url: "https://www.daraz.pk/laundry-cleaning/", products: [] },
  { url: "https://www.daraz.pk/home-improvement-tools/", products: [] },
  { url: "https://www.daraz.pk/stationery-craft/", products: [] },
  { url: "https://www.daraz.pk/books-games-music/", products: [] },
  { url: "https://www.daraz.pk/smartphones/", products: [] },
  { url: "https://www.daraz.pk/tablets/", products: [] },
  { url: "https://www.daraz.pk/laptops/", products: [] },
  { url: "https://www.daraz.pk/desktop-computer/", products: [] },
  { url: "https://www.daraz.pk/gaming-consoles/", products: [] },
  { url: "https://www.daraz.pk/camera/", products: [] },
  { url: "https://www.daraz.pk/security-cameras/", products: [] },
  { url: "https://www.daraz.pk/like-new-phones/", products: [] },
  {
    url: "https://www.daraz.pk/mobiles-tablets-accessories/",
    products: [],
  },
  {
    url: "https://www.daraz.pk/headphones-headsets/?spm=a2a0e.searchlistcategory.cate_2.2.7dcb7dc39yHrAb",
    products: [],
  },
  { url: "https://www.daraz.pk/wearable-technology/", products: [] },
  { url: "https://www.daraz.pk/camera-accessories/", products: [] },
  {
    url: "https://www.daraz.pk/computing-peripherals-accessories/",
    products: [],
  },
  { url: "https://www.daraz.pk/computing-storage/", products: [] },
  { url: "https://www.daraz.pk/multi-function-printers/", products: [] },
  { url: "https://www.daraz.pk/components-spare-parts/", products: [] },
  { url: "https://www.daraz.pk/networking/", products: [] },
  {
    url: "https://www.daraz.pk/gaming/?spm=a2a0e.searchlistcategory.breadcrumb.4.47c41cb6piO8tl",
    products: [],
  },
  {
    url: "https://www.daraz.pk/televisions/?spm=a2a0e.searchlistcategory.breadcrumb.3.61fe3418pORV8Y",
    products: [],
  },
  {
    url: "https://www.daraz.pk/refrigerators/?spm=a2a0e.searchlistcategory.card.1.2ce01e52GQFQOv&item_id=100924200&from=onesearch_category_10000272",
    products: [],
  },
  { url: "https://www.daraz.pk/unuse-category-url-key-134/", products: [] },
  { url: "https://www.daraz.pk/home-appliances/", products: [] },
  { url: "https://www.daraz.pk/cooling-heating/", products: [] },
  { url: "https://www.daraz.pk/garment-care/", products: [] },
  { url: "https://www.daraz.pk/portable-power-supply/", products: [] },
  {
    url: "https://www.daraz.pk/%20tv_video/?spm=a2a0e.searchlistcategory.breadcrumb.3.22f172dezj1BqV",
    products: [],
  },
  { url: "https://www.daraz.pk/tv-accessories/", products: [] },
  { url: "https://www.daraz.pk/floorcare-appliances/", products: [] },
  { url: "https://www.daraz.pk/exercise-fitness/", products: [] },
  { url: "https://www.daraz.pk/sp-nutrition/", products: [] },
  { url: "https://www.daraz.pk/shoes-clothing/", products: [] },
  { url: "https://www.daraz.pk/team-sports/", products: [] },
  { url: "https://www.daraz.pk/racket-sports/", products: [] },
  { url: "https://www.daraz.pk/outdoor-activities/", products: [] },
  { url: "https://www.daraz.pk/fitness-gadgets/", products: [] },
  {
    url: "https://www.daraz.pk/sports-outdoors-accessories/",
    products: [],
  },
  { url: "https://www.daraz.pk/mens-watches/", products: [] },
  { url: "https://www.daraz.pk/womens-watches/", products: [] },
  { url: "https://www.daraz.pk/kids-watches-wsj/", products: [] },
  {
    url: "https://www.daraz.pk/womens-bags/?spm=a2a0e.searchlistcategory.cate_10.10.752f2e2edTH6RZ",
    products: [],
  },
  { url: "https://www.daraz.pk/mens-bags/", products: [] },
  {
    url: "https://www.daraz.pk/travels/?spm=a2a0e.searchlistcategory.breadcrumb.3.102f7e62jWU6bc",
    products: [],
  },
  { url: "https://www.daraz.pk/womens-jewellery/", products: [] },
  { url: "https://www.daraz.pk/mens-jewellery/", products: [] },
  { url: "https://www.daraz.pk/men-accessories/", products: [] },
  {
    url: "https://www.daraz.pk/womens-accessories/?spm=a2a0e.pdp.breadcrumb.3.690754aaiEaRSQ",
    products: [],
  },
  { url: "https://www.daraz.pk/sunglasses/", products: [] },
  { url: "https://www.daraz.pk/automotive/", products: [] },
  { url: "https://www.daraz.pk/motorcycle/", products: [] },
  {
    url: "https://www.daraz.pk/catalog/?q=Auto+Rikshaw+and+loaders&_keyori=ss&from=input&spm=a2a0e.home.search.go.35e34937f903ki",
    products: [],
  },
];

const jinx = [
  {
    url: "https://www.daraz.pk/smartphones/",
    products: [],
  },
  {
    url: "https://www.daraz.pk/baseballs",
    products: [],
  },
];

const getProducts = async (links) => {
  for (let i = 0; i < links.length; i++) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        // req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(links[i].url, {
      timeout: 300000,
      waitUntil: "networkidle0",
    });

    let hasNextPage = true;
    while (hasNextPage) {
      try {
        await page.waitForSelector(".gridItem--Yd0sa", {
          timeout: 300000,
          waitUntil: "networkidle0",
        });
        console.log("found the selector gridItem--Yd0sa");
        const products = await page.$$eval(".gridItem--Yd0sa", (items) => {
          return items.map((item) => {
            const title = item.querySelector(".title-wrapper--IaQ0m").innerText;
            const link = item.querySelector("#id-a-link").href;
            return { title, link };
          });
        });
        links[i].products.push(...products);

        try {
          await page.waitForSelector(".ant-pagination", {
            timeout: 300000,
          });
          console.log(`there is pagination `);

          const lastPaginationItem = await page.$("li.ant-pagination-next a");
          const isLastItemDisabled = await page.$eval(
            "li.ant-pagination-next",
            (item) => item.getAttribute("aria-disabled") === "true"
          );
          if (isLastItemDisabled) {
            hasNextPage = false;
          } else {
            await lastPaginationItem.click();
          }
        } catch (error) {
          console.log(error);
          console.log("there is no ant pagination");
          hasNextPage = false;
        }
      } catch (error) {
        console.log("there is no gridItem-Yd0sa selector");
        hasNextPage = false;
      }
    }
    console.log(links[i].products.length);
    await browser.close();
  }

  const jsonString = JSON.stringify(links);
  fs.writeFile("singleton.json", jsonString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Data saved to singleton.json`);
    }
  });
};

getProducts(jinx);
