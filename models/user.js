const mongoose= require('mongoose');
const {ObjectId}= mongoose.Schema.Types

const userSchema = new mongoose.Schema({
   name :{
    type:String,
    required:true 
   },
   email:{
    type:String,
    required:true 
   },
   password:{
    type:String,
    required: true 
   },
   pic:{
         type:String,
         default:"https://res.cloudinary.com/dv4a2jca4/image/upload/v1686832314/default_profile_q6c9ub.avif"
   },
   followers:[{type:ObjectId, ref:'User'}],
   following:[{type:ObjectId, ref:'User'}]
})
mongoose.model("User" , userSchema);