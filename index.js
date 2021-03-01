const puppeteer = require("puppeteer");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getContent(url, rootClass, options) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation({
    waitUntil: "load",
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

async function getVideo(url) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation({
    waitUntil: "load",
  });

  await page.goto(url);

  await navigationPromise;

  const results = await page.evaluate(() => {
    return document.querySelector("iframe").getAttribute("src");
  });

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

const myYogaSession = [];

getPosesByAnatomy("ankles")
  .then(async (benefits) => {
    return asyncForEach(benefits, async (benefit) =>
      myYogaSession.push({
        ...benefit,
        video: await getVideo(benefit.link),
      })
    );
  })
  .then(() => console.log(myYogaSession));
