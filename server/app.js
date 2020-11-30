const express = require("express");
const app = express();
const Post = require('./models/posts')
app.use(express.json());

// console log the fired requests
function logger(req, res, next) {
    console.log(`request fired ${req.url} ${req.method}`);
    next();
  }
app.use(logger);

// get all the posts
app.get('/api/posts/', async (req,res) =>{
    try{
        const allPosts = await Post.find({})
        res.json(allPosts)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})
// posts filter by title
app.get('/api/posts/:title', async (req,res) =>{
    try{
      const { title } = req.params
        const postsByTitle = await Post.find({
          title: { $regex: title, $options: 'i' }
        })
        res.json(postsByTitle)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})



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