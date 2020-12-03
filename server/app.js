const express = require("express");
const app = express();
const { scrapping } = require("./scrapping");
// const {getAllElastic} = require('./elasticsearch');
const mongoose = require("mongoose");
const Notification = require("./models/notification");
const cors = require("cors");
app.use(express.json());

app.use(cors());

// connect to mondoDB
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// console log the fired requests
function logger(req, res, next) {
  console.log(`request fired ${req.url} ${req.method}`);
  next();
}
app.use(logger);

app.use("/api", require("./api"));

// network error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

// unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

setInterval(async () => {
  const posts = await scrapping();
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
}, 120000);

module.exports = app;
