//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Anshul_ojha:Luhsna@atlascluster.ekt7t1o.mongodb.net/userdb", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newuser = new User({
        email: req.body.username,
        password: req.body.password
    });
     
    // newuser.save(function(){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.render("secrets");
    //     }
    // });
    
    newuser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
    
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;


    try {
        const data = User.findOne({ email:username, password:password });

        if (data) {
            res.render("secrets");
        }
    } catch (err) {
        console.error(err);
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});