const express = require("express");
const app = express();
const { scrapping } = require("./scrapping");
const mongoose = require("mongoose");

app.use(express.json());

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


module.exports = app;
