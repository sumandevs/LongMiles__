const express = require("express");
const router = express.Router();
const Trekking = require("../models/trekkingGrounds");
const Reviewtr = require("../models/reviewtr");
const middlewareObj = require("../middleware");

//new Review Route - GET
router.get("/new", (req,res) => {
    Trekking.findById(req.params.id, function(err,foundTrekk){
        if(err && !foundTrekk){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        console.log(foundTrekk);
        res.render("reviewsTrekk/new", {foundTrekk: foundTrekk});
    });
});

//Create review route - POST
router.post("/", (req,res) => {
    res.send("this is review create page");
});



//==============================================================================
module.exports = router;