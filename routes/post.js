const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogoin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost",requireLogoin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy" ,"_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsubpost",requireLogoin, (req, res) => {
  Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy" ,"_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogoin, (req, res) => {
  const { title, body,pic } = req.body;
  //console.log(title , body , pic)
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "please add all fields" });
  }
  req.user.password = undefined;

  const post = new Post({
    title,
    body,
   photo:pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost",requireLogoin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy","_id name")
    .then(mypost => {
      res.json({ mypost });
    })
    .catch(err => {
      console.log(err);
    });
});

router.put('/like',requireLogoin , (req , res)=>{
  Post.findByIdAndUpdate(req.body.postId ,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).then(result=>{
    res.json(result)
  }).catch(err=>{
    console.log(err);
  })
});

router.put('/unlike',requireLogoin , (req , res)=>{
  Post.findByIdAndUpdate(req.body.postId ,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).then(result=>{
    res.json(result)
  }).catch(err=>{
    console.log(err)
  })
});

router.put('/comment',requireLogoin , (req , res)=>{
  const comment = {
    text :req.body.text,
    postedBy:req.user._id 
  }
  Post.findByIdAndUpdate(req.body.postId ,{
    $push:{comments:comment}
  },{
    new:true
  }).populate("comments.postedBy" , "_id name").populate("postedBy","_id name").then(result=>{
    res.json(result)
  }).catch(err=>{
    console.log(err);
  })
});

router.delete('/deletepost/:postId',requireLogoin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err ,post)=>{
    if(err || !post){
      return res.status(422).json({error :err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
        post.remove().then(result=>{
          res.json(result)
        }).catch(err=>{
          console.log(err)
        })
    }
  })
})


module.exports = router;
