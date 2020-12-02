const { Router } = require("express");
const Post = require("../models/posts");
const router = Router();

// pie chart for labels
router.get("/labels", async (req, res) => {
  try {
    const labels = ["weapons", "money" , "url", "porn", "internet"]
    const posts = await Post.find({
      labels: { $not:{$size:0} },
    }).select("labels");
    let result = [];
    labels.forEach(label=>{
        let counter = 0;
        posts.forEach(post=>{
            if(post.labels.includes(label)){
                counter++;
            }
        })
        result.push({name:label, count:counter});
    })
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});

// line chart by times
router.get("/time", async (req, res) => {
  try {
    const postsDate = await Post.find({}).select("date");
    let result = [];
    for (let i = 0; i < 24; i++) {
      let counter = 0;
      postsDate.forEach((date) => {
        if (new Date(date.date).getHours() === i) {
          counter = counter + 1;
        }
      });
      const time = i<10? `0${i}:00`:`${i}:00`
      result.push({ hour:time , posts: counter });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
