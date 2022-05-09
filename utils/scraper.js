const puppeteer = require("puppeteer");

const scraper = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [link] = await page.$x('//*[@id="main-content"]/div[1]/div[2]/div/div/ul/li[1]/div/div/div/div[1]/div[1]/a');
    const href = await link.getProperty("href");
    const rawLink = await href.jsonValue();
    console.log(rawLink);
    


    await browser.close();
}

scraper("https://www.bbc.co.uk/sport")

module.exports = scraper;