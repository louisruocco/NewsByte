const mongoose = require("mongoose");

const db = mongoose.connect("mongodb://localhost/news-web-scraper", () => {
    console.log("Data Schema Connected...");
});

const dataSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    link: String
})

const data = mongoose.model("data", dataSchema);
module.exports = data;