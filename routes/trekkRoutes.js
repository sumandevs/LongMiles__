const express  = require("express");
const router   = express.Router();
const Trekking = require("../models/trekkingGrounds");
const middlewareObj = require("../middleware");
//===========================
 //For Image Upload
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'sumandeveloping', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//============================================================================

//trekking routes
  //New Trekks -GET
router.get("/new", (req,res) => {
    res.render("activities/newTrekking");
});
  // Create routes - POST --creating new trek to Db
router.post("/", upload.single('image'), (req,res) => {
    cloudinary.v2.uploader.upload(req.file.path, function(err,result){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        // add cloudinary url for the image to the campground object under image property
        req.body.trek.image   = result.secure_url;
        // add image's public_id to campground object
        req.body.trek.imageId = result.public_id;
        // add author to trek
        req.body.trek.author = {
        id: req.user._id,
        username: req.user.username
        };
        //creating trekks
        Trekking.create(req.body.trek,function(err,newTrekks){
            if(err){
                req.flash("error",err.message);
                res.redirect("back");
            }
            else {
                req.flash("success", "A new trekkking activity has been added");
                res.redirect("/activities");
            }
        });
    });
});

//================================================

//SHOW Route -- showing a particular grounds..
  // TREKS...
router.get("/:id", (req,res) => {
    Trekking.findById(req.params.id).populate("comments").exec(function(err,foundTrekking){
        if(err && !foundTrekking){
            req.flash("error", "Trekking activity not found");
            res.redirect("back");
        }
        else {
            res.render("activities/showTrekk", {trekkingGround: foundTrekking});
        }
    });
});

// ============================== EDIT & UPDATE =========================================
 //EDIT TREKKings
router.get("/:id/edit", middlewareObj.checkTrekkingOwnership, (req,res) => {
    Trekking.findById(req.params.id, function(err,foundTrekk){
        if(err){
            res.redirect("/activities");
        } else {
            res.render("activities/editTrekk", {trekk: foundTrekk});
        }
    });
});
 //UPDATE TREKKings
router.put("/:id", upload.single('image'), middlewareObj.checkTrekkingOwnership, (req,res) => {
    Trekking.findById(req.params.id, async function(err,updatedTrekk){
        if(err && !updatedTrekk){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file){
                try{
                    await cloudinary.v2.uploader.destroy(updatedTrekk.imageId);
                    let result = await cloudinary.v2.uploader.upload(req.file.path);
                    updatedTrekk.imageId = result.public_id;
                    updatedTrekk.image   = result.secure_url;
                } catch (err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }
            updatedTrekk.title = req.body.title;
            updatedTrekk.description = req.body.description;
            updatedTrekk.save();
            req.flash("success","Trekking activity successfully updated.");
            res.redirect("/activities/trekkings/" + req.params.id);
        }
    });
});
//=============================== DELETE TREKK ================================
router.delete("/:id", middlewareObj.checkTrekkingOwnership, (req,res) =>{
    Trekking.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Trekking activity has been deleted!");
            res.redirect("/activities");
        }
    });
});

//=====================================================================


module.exports = router;