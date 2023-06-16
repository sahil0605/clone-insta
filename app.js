const express = require('express');
const app = express();
const mongoose = require("mongoose");




const PORT = 5000 ;
const {MONGOURI} = require('./keys')
mongoose.connect(MONGOURI , {
    useNewUrlParser:true ,
    useUnifiedTopology : true 
});

mongoose.connection.on('connected', ()=>{
    console.log("mongo connected");
})
mongoose.connection.on('error', (err)=>{
    console.log("error", err);
})

require('./models/user');
require("./models/post");

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
//G36JLa75CqOFFygY



app.listen(PORT , ()=>{
    console.log("server is running on " , PORT);
})