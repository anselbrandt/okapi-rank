import puppeteer from "puppeteer";

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
}

await scrape(
  { name: "United Kingdom", code: "gb", scrollDistance: 1000 },
  { name: "News", genre: 1489, filename: "news" }
);

// { name: "United States", code: "us", scrollDistance: 2000 }
