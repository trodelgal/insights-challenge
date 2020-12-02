const { Router } = require("express");
const Post = require('../models/posts')
const router = Router();

// posts filter by labels
router.get('/:label', async (req,res) =>{
    try{
      const label = req.params.label
      console.log(label);
        const postsByLabels = await Post.find({
          labels: { "$in" : [label]} 
        }).sort({ date: -1})
        res.json(postsByLabels)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})

module.exports = router;