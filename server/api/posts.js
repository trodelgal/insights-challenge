const { Router } = require("express");
const Post = require('../models/posts')
const router = Router();

// get all the posts
router.get('/', async (req,res) =>{
    try{
        const allPosts = await Post.find({}).sort({ date: -1})
        res.json(allPosts)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})

// posts filter by title
router.get('/:title', async (req,res) =>{
    try{
      const { title } = req.params
        const postsByTitle = await Post.find({
          title: { $regex: title, $options: 'i' }
        }).sort({ date: -1})
        res.json(postsByTitle)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})

module.exports = router;