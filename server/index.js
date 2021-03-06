require("dotenv").config();
const app = require("./app");
const { scraper } = require("./scraper");
const Notification = require("./models/notification");

// scrap the website
setInterval(async () => {
  const posts = await scraper();
  console.log(posts)
  if (typeof posts === "object") {
    const notification = new Notification({
      message: "New posts have been posted",
      post: posts,
      date: Date.now(),
    });
    notification
      .save()
      .then((savedNotification) => {
        console.log(savedNotification);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (typeof posts === "string") {
    const notification = new Notification({
      message:`SCRAPER ERROR: ${posts}`,
      post: [],
      date: Date.now(),
    });
    notification
      .save()
      .then((savedNotification) => {
        console.log(savedNotification);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}, 300000);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
