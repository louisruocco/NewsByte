const puppeteer = require("puppeteer");
const data = require("../db/schemas/data");

const scraper = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [title] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/a')
    const txt = await title.getProperty("textContent");
    const rawTxt = await txt.jsonValue();
    console.log(rawTxt);

    const [description] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/p')
    const desc = await description.getProperty("textContent");
    const rawDesc = await desc.jsonValue();
    console.log(rawDesc);

    const [link] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/a')
    const href = await link.getProperty("href");
    const rawHref = await href.jsonValue();
    console.log(rawHref);

    await data.create({
        title: rawTxt, 
        description: rawDesc, 
        link: rawHref
    })
}

scraper("https://www.bbc.co.uk/news")

module.exports = scraper;