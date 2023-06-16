const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET}= require('../keys');
const requireLogoin= require('../middleware/requireLogin')

router.get('/protected',requireLogoin,(req , res)=>{
  res.send("hello")
})

router.post("/signup", (req, res) => {
  const { name, email, password ,pic} = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({ error: "please add all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exist" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          pic:pic
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "saved succesfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ message: "invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
         // res.json({ message: "successfully signed in" });
         const token = jwt.sign({_id: savedUser._id} , JWT_SECRET);
         const {_id , name , email,following , followers,pic}= savedUser;
         console.log(savedUser)
         res.json({token , user:{_id ,name , email,following,followers,pic}});
        } else {
          return res.status(422).json({ message: "invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
