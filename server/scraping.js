// require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const Post = require("./models/posts");

const scraping = async () => {
  try {
    const browser = await puppeteer.launch({
      args: ["--proxy-server=socks5://127.0.0.1:9050"],
      // headless: false,
    });

    const page = await browser.newPage();
    await page.goto("http://nzxj65x32vh2fkhk.onion/all");
    // await page.goto("http://127.0.0.1:5500/index.html");

    // bring the titles
    const rowsTitles = await page.$$eval("h4", (element) =>
      element.map((node) => node.innerText)
    );

    // bring the body text
    const bodyList = await page.$$("ol");
    const bodyText = await Promise.all(
      bodyList.map((ol) =>
        ol.$$eval("div", (element) => element.map((node) => node.innerText))
      )
    );

    // bring the date and the posted name
    const details = await page.$$eval('div[class="col-sm-6"]', (element) =>
      element.map((n) => n.innerText)
    );

    // bring the views
    const views = await page.$$eval(
      'div[class="col-sm-6 text-right"]',
      (element) => element.map((n) => n.innerText)
    );

    let posts = [];
    for (let i = 0; i < rowsTitles.length; i++) {
      posts.push({
        title: rowsTitles[i],
        content: bodyText[i],
        author: details[i].split("at")[0],
        date: details[i].split("at")[1],
        views: views[i].split(":")[2],
      });
    }

    let dataJson = await fs.readFile("./posts.json");
    const existData = JSON.parse(dataJson);
    const newPosts = [];

    posts.forEach((post) => {
      if (!existData.some((exist) => exist.title === post.title)) {
        existData.push(post);
        newPosts.push(post);
      }
    });

    console.log(newPosts);
    await fs.writeFile("./posts.json", JSON.stringify(existData, null, 2));
    if(newPosts[0]){
      newPosts.forEach((val) => {
        const post = new Post(val);
        post
          .save()
          .then((savedPost) => {
            console.log(savedPost);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    browser.close();
  } catch (err) {
    console.log(err);
  }
};

module.exports.scraping = scraping;
