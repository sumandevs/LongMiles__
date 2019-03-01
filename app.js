require('dotenv').config();

const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      methodOverride = require("method-override"),
      flash      = require("connect-flash"),     
      passport   = require("passport"),
      localStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      Trekking   = require("./models/trekkingGrounds"),
      Tour       = require("./models/familyTours"),
      Comment    = require("./models/comment"),
      User       = require("./models/user"),
      Reviewtr   = require("./models/reviewtr");

//Requiring Routes..
const trekkRoutes    = require("./routes/trekkRoutes"),
      tourRoutes     = require("./routes/tourRoutes"),
      commentsRoutes = require("./routes/commentsRoutes"),
      indexRoutes    = require("./routes/indexRoutes"),
      reviewTrekk    = require("./routes/reviewTrekk")
      
//App config
mongoose.connect('mongodb://localhost:27017/longMiles__', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//PASSPORT CONFIG -
app.use(require("express-session")({
    secret: "I love node.js",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local variables
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

//USING ROUTES
app.use("/activities/trekkings",trekkRoutes);
app.use("/activities/tours",tourRoutes);
app.use("/activities",commentsRoutes);
app.use("/activities/trekkings/:id/reviews",reviewTrekk);
app.use(indexRoutes);







//=======================================================================
//connecting to server
app.listen(process.env.PORT,process.env.IP, () => {
    console.log("Server has started!!");
});