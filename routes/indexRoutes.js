const express  = require("express");
const router   = express.Router();
const Trekking = require("../models/trekkingGrounds");
const Tour     = require("../models/familyTours");
const User     = require("../models/user");
const passport = require("passport");
const middlewareObj = require("../middleware");

//landing
router.get("/", (req,res) => {
    res.render("landing");
});

//Index route - Showing ALLActivities
router.get("/activities", (req,res) => {
    Trekking.find({},function(err,trekks){
         if(err){
             console.log(err);
         } else {
             Tour.find({},function(err,tours){
                 if(err){
                     console.log(err);
                 } else {
                     res.render("activities/index",{allTrekkings: trekks, allTours: tours});
                 }
             });
         }
    });
});

// ChooseActivity -get //=====================================
router.get("/activities/chooseActivity", middlewareObj.isLoggedIn, (req,res) => {
    res.render("activities/chooseActivity");
});
// ChooseActivity -Post
router.post("/activities/chooseActivity", middlewareObj.isLoggedIn, (req,res) => {
    const selectedActivity = req.body.select;
    if(selectedActivity === "trekking"){
        res.redirect("/activities/trekkings/new");
    } else {
        res.redirect("/activities/tours/new");
    }
});   

//======================================================================
 //AUTH ROUTES
//REGISTER 
 //Show register template - GET
router.get("/register", (req,res) => {
    res.render("register");
});
 //Create an user - POST
router.post("/register", (req,res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        username : req.body.username
    });
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to LONGMiles__ , " + req.user.username);
            res.redirect("/activities");
        });
    });
});

//LOGIN
 //show login template - GET
router.get("/login", (req,res) => {
    res.render("login");
});
 //login user - POST
router.post("/login", passport.authenticate("local", 
        {
            successRedirect: "/activities",
            failureRedirect: "/login"
        }),(req,res) => {
            
});

//LOGOUT
router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success", "Successfully logged you out");
    res.redirect("/activities");
});
//===================================


module.exports = router;