const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule")

dotenv.config({path: "./.env"})

const date = new Date();
const day = date.getDay();
const month = date.getMonth();
const year = date.getFullYear();

const months = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
]

const scraper = schedule.scheduleJob("0 7 * * *", async () => {
    const url = "https://www.bbc.co.uk/news";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [mainTitle] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/a')
    const txt = await mainTitle.getProperty("textContent");
    const rawTxt = await txt.jsonValue();

    const [mainDescription] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/p')
    const desc = await mainDescription.getProperty("textContent");
    const rawDesc = await desc.jsonValue();

    const [mainLink] = await page.$x('//*[@id="nw-c-topstories-england"]/div/div/div[1]/div/div[1]/div/div/div[1]/div/a')
    const href = await mainLink.getProperty("href");
    const rawHref = await href.jsonValue();
    
    const [article1Title] = await page.$x('//*[@id="nw-c-topstories-domestic"]/div[2]/div/div[1]/div/div[1]/div/div/div[2]/div/a')
    const txt1 = await article1Title.getProperty("textContent");
    const rawTxt1 = await txt1.jsonValue();

    const [article1Description] = await page.$x('//*[@id="nw-c-topstories-domestic"]/div[2]/div/div[1]/div/div[1]/div/div/div[2]/div/p')
    const desc1 = await article1Description.getProperty("textContent");
    const rawDesc1 = await desc1.jsonValue();

    const [article1Link] = await page.$x('//*[@id="nw-c-topstories-domestic"]/div[2]/div/div[1]/div/div[1]/div/div/div[2]/div/a')
    const href1 = await article1Link.getProperty("href");
    const rawHref1 = await href1.jsonValue();

    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASS
        }
    });

    const html = `
        <body>
            <h1>NewsByte - ${day} ${months[month]} ${year}</h1>
            <ul>
                <h2>Top Stories:</h2>
                <li><a href = ${rawHref}>${rawTxt}</a><br>${rawDesc}</li>
                <li><a href = ${rawHref1}>${rawTxt1}</a><br>${rawDesc1}</li>
            </ul>
        </body>
    `

    const options = {
        from: process.env.EMAIL,
        to: "louisruocco1@gmail.com",
        subject: `NEWSBYTE - ${day} ${months[month]} ${year}`, 
        html,
    };

    transporter.sendMail(options, (err, info) => {
        if(err){
            return console.log(err);
        } else {
            console.log("sent: " + info.response);
        }
    })

    await browser.close();
})

module.exports = scraper;