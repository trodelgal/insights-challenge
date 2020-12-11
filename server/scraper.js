require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const Post = require("./models/posts");

const scraper = async () => {
  try {
    const labels = [
      { key: "weapons", dict: ["weapons", "Weapon", "guns"] },
      { key: "porn", dict: ["fuck", "porn", "porno"] },
      {
        key: "money",
        dict: ["bitcoins", "bitcoin", "buy", "invest", "money", "credit card"],
      },
      { key: "url", dict: ["http"] },
      { key: "internet", dict: ["instegram", "facebook", "hack", "google"] },
    ];
    console.log("start scraper");
    // open puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        "--disable-dev-shm-usage",
        // "--proxy-server=socks5://127.0.0.1:9050",
        '--proxy-server=socks5://proxy:9050',
        '--user-agent="Mozilla/5.0 (Windows NT 6.1; rv:60.7) Gecko/20100101 Firefox/60.7"',
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });
    // open the website
    const page = await browser.newPage();
    await page.goto("http://nzxj65x32vh2fkhk.onion/all");

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

    browser.close();

    let posts = [];
    for (let i = 0; i < rowsTitles.length; i++) {
      posts.push({
        title: rowsTitles[i],
        content: bodyText[i].join(" "),
        author: details[i].split("at")[0],
        date: new Date(details[i].split("at")[1].slice(1, 22)).getTime(),
        labels: [],
        views: views[i].split(":")[2],
      });
    }

    const allPosts = await Post.find({});
    const newPosts = [];

    posts.forEach((post) => {
      if (
        !allPosts.some((exist) => exist.title === post.title) &&
        !allPosts.some((exist) => exist.date === post.date)
      ) {
        labels.forEach((label) => {
          label.dict.forEach((dict) => {
            if (
              post.title.toLowerCase().includes(dict) ||
              post.content.toLowerCase().includes(dict)
            ) {
              post.labels.push(label.key);
              return;
            }
          });
        });
        newPosts.push(post);
      }
    });
    console.log(newPosts);

    if (newPosts[0]) {
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
      return newPosts;
    }
    return;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

module.exports.scraper = scraper;
