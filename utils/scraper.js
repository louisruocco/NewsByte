const puppeteer = require("puppeteer");

const scraper = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [title] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[3]/div/div[2]/div/a');
    const link = page.url();
    const txt = await title.getProperty("textContent");
    const rawTxt = await txt.jsonValue();

    console.log(rawTxt)

    browser.close();
}

scraper("https://www.bbc.co.uk/news")

module.exports = scraper;