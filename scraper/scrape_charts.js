import fs from "fs/promises";

import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const CHARTS_DIR = args[0] || "data/charts";

const scroll = async (page, idx, distance, timeout) => {
  await page.evaluate(
    (idx, distance) => {
      function findScrollableElements() {
        const allElements = document.querySelectorAll("*");
        const scrollables = [];

        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const overflowY = style.getPropertyValue("overflow-y");
          const overflow = style.getPropertyValue("overflow");

          if (
            overflowY === "auto" ||
            overflowY === "scroll" ||
            overflow === "auto" ||
            overflow === "scroll"
          ) {
            if (el.scrollHeight > el.clientHeight) {
              scrollables.push(el);
            }
          }
        });

        return scrollables;
      }

      const scrollables = findScrollableElements();
      if (scrollables[idx]) {
        scrollables[idx].scrollBy({ top: distance, behavior: "smooth" });
      }
    },
    idx,
    distance
  );
  await new Promise((resolve) => setTimeout(resolve, timeout));
};

async function scrape(country, category) {
  const url = `https://podcasts.apple.com/${country.code}/charts?genre=${category.genre}`;

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1600,
      height: 800,
    },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const dropdownButton = await page.$(
    'button.dropdown-button[data-testid="dropdown-button"]'
  );
  if (dropdownButton) {
    await page.click('button.dropdown-button[data-testid="dropdown-button"]');
    await page.waitForSelector('ul[role="menu"]');
    const menuItems = await page.$$('ul[role="menu"] li');
    for (const item of menuItems) {
      const txt = await item.evaluate((el) => el.textContent.trim());
      if (txt === "Select a country or region") {
        await item.click();
        break;
      }
    }

    await page.waitForSelector(
      'button.select-button[data-testid="select-button"]',
      { visible: true }
    );
    await page.click('button.select-button[data-testid="select-button"]');

    await scroll(page, 1, country.scrollDistance, 500);

    await page.evaluate((country) => {
      const regionContainer = document.querySelector("div.region-container");
      const regionLinks = regionContainer.querySelectorAll(
        'a[data-testid="region-list-link"]'
      );

      for (const link of regionLinks) {
        const spanText = link.querySelector("span")?.textContent.trim();
        if (spanText === country.name) {
          link.click();
          break;
        }
      }
    }, country);

    await new Promise((resolve) => setTimeout(resolve, 900));

    await page.click(
      '#body-container > div > div.banner-container > div > button[aria-label="Close"]'
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  }

  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button.title__button")].find(
      (btn) =>
        btn.querySelector("span.dir-wrapper")?.textContent.trim() ===
        "Top Shows"
    );

    if (button) {
      button.click();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 900));

  await scroll(page, 0, 3000, 900);
  await scroll(page, 0, 3000, 900);
  await scroll(page, 0, 3000, 900);
  await scroll(page, 0, 3000, 900);

  const html = await page.content();

  const filepath = `${CHARTS_DIR}/${country.code}/${category.filename}.html`;
  await fs.writeFile(filepath, html);

  await browser.close();
}

const categories = [
  { name: "Arts", genre: 1301, filename: "arts" },
  { name: "Business", genre: 1321, filename: "business" },
  { name: "Comedy", genre: 1303, filename: "comedy" },
  { name: "Education", genre: 1304, filename: "education" },
  { name: "Fiction", genre: 1483, filename: "fiction" },
  { name: "Government", genre: 1511, filename: "government" },
  { name: "Health & Fitness", genre: 1512, filename: "health_and_fitness" },
  { name: "History", genre: 1487, filename: "history" },
  { name: "Kids & Family", genre: 1305, filename: "kids_and_family" },
  { name: "Leisure", genre: 1502, filename: "leisure" },
  { name: "Music", genre: 1310, filename: "music" },
  { name: "News", genre: 1489, filename: "news" },
  {
    name: "Religion & Spirituality",
    genre: 1314,
    filename: "religion_and_spirituality",
  },
  { name: "Science", genre: 1533, filename: "science" },
  { name: "Society & Culture", genre: 1324, filename: "society_and_culture" },
  { name: "Sports", genre: 1545, filename: "sports" },
  { name: "Technology", genre: 1318, filename: "technology" },
  { name: "True Crime", genre: 1488, filename: "true_crime" },
  { name: "TV & Film", genre: 1309, filename: "tv_and_film" },
];

const countries = [
  { name: "Australia", code: "au", scrollDistance: 600 },
  { name: "Canada", code: "ca", scrollDistance: 2000 },
  { name: "Ireland", code: "ie", scrollDistance: 700 },
  { name: "New Zealand", code: "nz", scrollDistance: 600 },
  { name: "United Kingdom", code: "gb", scrollDistance: 1000 },
  { name: "United States", code: "us", scrollDistance: 2000 },
];

const filesToScrape = countries.length * categories.length;
console.log("Scraping", filesToScrape, "pages");

const totalStart = Date.now();
let filesScraped = 0;

for (const country of countries) {
  await fs.mkdir(`${CHARTS_DIR}/${country.code}`, { recursive: true });
  for (const category of categories) {
    const start = Date.now();
    await scrape(country, category);
    const end = Date.now();

    filesScraped++;

    const seconds = ((end - start) / 1000).toFixed(1);

    const elapsedMs = Date.now() - totalStart;
    const avgMsPerFile = elapsedMs / filesScraped;
    const remainingFiles = filesToScrape - filesScraped;
    const estimatedRemainingMs = avgMsPerFile * remainingFiles;
    const estimatedRemainingMinutes = Math.floor(
      estimatedRemainingMs / 1000 / 60
    );
    const estimatedRemainingSeconds = Math.floor(
      (estimatedRemainingMs / 1000) % 60
    );

    console.log(
      `${country.code.padEnd(5)} ${category.filename.padEnd(
        25
      )} ${seconds.padStart(6)}s  ` +
        `ETA: ${estimatedRemainingMinutes}m ${estimatedRemainingSeconds
          .toString()
          .padStart(2, "0")}s`
    );
  }
}
const totalEnd = Date.now();
const totalSeconds = Math.floor((totalEnd - totalStart) / 1000);
const mm = Math.floor(totalSeconds / 60);
const ss = totalSeconds % 60;
console.log(`${mm}:${ss}`);
