const express = require("express");
const app = express();
// const {getAllElastic} = require('./elasticsearch');
app.use(express.json());

// console log the fired requests
function logger(req, res, next) {
    console.log(`request fired ${req.url} ${req.method}`);
    next();
  }
app.use(logger);

app.use("/api", require("./api"));

// network error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
app.use(errorHandler)

// unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

module.exports = app;