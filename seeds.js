const mongoose = require("mongoose"),
      Trekking = require("./models/trekkingGrounds"),
      Tour     = require("./models/familyTours"),
      express  = require("express"),
      app      = express();

async function twoModules(){
    try{
        app.get("/activities",(req,res) => {
            let allTrekkings = await Trekking.find({});
            let allTours     = await Tour.find({});
            res.render("activities/index",{allTrekkings: allTrekkings, allTours: allTours});
        });
    }catch(err){
        console.log("Error Found!!!!!");
        console.log(err);
    }
}
    
module.exports = twoModules;