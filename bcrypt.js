//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { Console } = require('console');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs' );
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User" ,userSchema);


app.get("/" , function(req , res) {
   res.render("home");
})

app.get("/login" , function(req , res) {
   res.render("login");
})

app.get("/register" , function(req , res) {
   res.render("register");
})

app.post("/register" , function(req , res){

bcrypt.hash(req.body.password , saltRounds).then(function(hash){
 const newUser = new User({
        email: req.body.username,
        password:hash
    });
    newUser.save()
.then(()=>{
        res.render("secrets");
    })
.catch((err)=>{
        console.log(err);
    });
})
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username})
    .then(function(foundUser){
  bcrypt.compare(req.body.password, foundUser.password).then(function(result) {
        if(result == true){
          res.render("secrets");
        }
      });
    })
    .catch(function(err){
        console.log(err);
    })
})



app.listen(3000 , ()=> {
    console.log("Server started on port 3000");
});