
require('dotenv').config()
const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const urlencoded = require('body-parser/lib/types/urlencoded');

// middleware

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

// db setup
mongoose.connect("mongodb+srv://Nihalpratap71:" + process.env.MONGO + "@nihal.qhedf.mongodb.net/blogsDB")

// user schema
// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         unique: true,
//         required: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// })

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }

})
// model
const User = new mongoose.model("user", userSchema)

// blog schema

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
        
    },
    content:{
        type:String,
        required:true
            }
})
const Blog = new mongoose.model("blog",blogSchema)

app.route("/")
.get((req,res)=>{   
    res.render("home")
})



app.route("/blogs")
    .get((req, res) => {
        Blog.find({},(err,result)=>{
            if(!err){
                console.log(result);
                res.render("blogs",{
                result:result,
            });
            }else{
                console.log(err);
            }
        })
    });




app.route("/login")
    .get((req, res) => {
        res.render("login")
    })

    .post((req, res) => {
        const email = req.body.email
        const password = req.body.password

        User.findOne({ email: email }, (err, foundUser) => {
            if (!err) {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if(result){
                        console.log(result);
                        res.render("blogs")
                    }else{
                        res.redirect("/")
                    }
                })
            }
        })


    })




app.route("/signup")
    .get((req, res) => {
        res.render("signup")
    })
    .post((req, res) => {
        const userName = req.body.email
        const password = req.body.password
        bcrypt.hash(password, 15, function (err, hash) {
            console.log(hash)
            const user = new User({
                email: userName,
                password: hash
            })
            user.save((err) => {
                if (!err) {
                    res.render("blogs")
                    console.log(`user registered ${user}`);
                } else {
                    console.log({ error: { error: err } });
                }
            })
        })

    });

    app.route("/compose")
    .get((req,res)=>{
        res.render("compose")
    })

    .post((req,res)=>{
        var blog = new Blog({
            title:req.body.title,
            content:req.body.content    
        });
        blog.save((err)=>{
            if(!err){
                console.log("item saved ")
                res.redirect("/blogs")
            }else{
                console.log(err)
                res.redirect("compose")
            }
                
            
        }) 
    })




app.listen(3000 || process.env.PORT, (req, res) => {
    console.log("server started on port : 3000");
})