const puppeteer = require("puppeteer");

async function getContent(url, rootClass, options) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  await page.goto(url);

  await navigationPromise;

  const results = await page.evaluate(
    (rootClass, options) => {
      const elements = [...document.querySelectorAll(`.${rootClass} article`)];

      return elements.map((element) => {
        return {
          image: element.querySelector("picture").getAttribute("data-iesrc"),
          link: element.querySelector("a").getAttribute("href"),
          type: !!options.hasType
            ? element.querySelector(".c-block__kicker").innerText
            : undefined,
          name: element.querySelector(".c-block__title").innerText,
        };
      });
    },
    rootClass,
    options
  );
  await browser.close();
  return results;
}

async function getBenefitsList() {
  return await getContent(
    "https://www.yogajournal.com/poses/yoga-by-benefit/",
    "c-taxonomy-reference",
    { hasType: false }
  );
}

async function getAnatomyList() {
  return await getContent(
    "https://www.yogajournal.com/poses/anatomy/",
    "c-taxonomy-reference",
    { hasType: false }
  );
}

async function getBenefitsList() {
  return await getContent(
    "https://www.yogajournal.com/poses/yoga-by-benefit/",
    "c-taxonomy-reference",
    { hasType: false }
  );
}

async function getPosesByBenefit(benefit) {
  return await getContent(
    `https://www.yogajournal.com/poses/yoga-by-benefit/${benefit}/`,
    "c-atomic-reference",
    { hasType: true }
  );
}

async function getPosesByAnatomy(anatomy) {
  return await getContent(
    `https://www.yogajournal.com/poses/anatomy/${anatomy}/`,
    "c-atomic-reference",
    { hasType: true }
  );
}

// getAnatomyList().then(console.log);

getPosesByAnatomy("ankles").then((benefits) => {
  console.log(benefits);
});
