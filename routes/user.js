const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogoin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogoin, (req, res) => {
  User.find({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user not found" });
    });
});

router.put("/follow", requireLogoin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
            
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
  )
});

router.put("/unfollow", requireLogoin, (req, res) => {
    User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true },(err,result)=>{
          if(err){
              return res.status(422).json({error:err})
          }
  
          User.findByIdAndUpdate(req.user._id,{
              $pull:{following:req.body.followId}
              
          },{new:true}).select("-password").then(result=>{
              res.json(result)
          }).catch(err=>{
              return res.status(422).json({error:err})
          })
      }
    )
  });
module.exports = router;
