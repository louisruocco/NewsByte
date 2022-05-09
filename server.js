const express = require("express");
const dotenv = require("dotenv");
const scraper = require("./utils/scraper");
const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at ${port}`));

