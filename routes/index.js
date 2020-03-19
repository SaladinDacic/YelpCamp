var express =   require("express");
var router  =   express.Router();
var passport =  require("passport");
var User =      require("../models/user");



//Landing route
router.get("/",function(req, res){
    res.render("landing");
});



//AUTH ROUTES
//Show Sign Up form
router.get("/register", function(req, res){
    res.render("register");
});
//Handle Sign Up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        };
        passport.authenticate("local")(req, res ,function(){
            req.flash("success", "You successfully signed up!");
            res.redirect("/campgrounds");
        });
    });
});


//LOGIN ROUTES
//Show login form
router.get("/login", function(req, res){
    res.render("login");
});
//Handling login logic


router.post("/login", function (req, res, next) {
    passport.authenticate("local",
      {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
      })(req, res);
  });
  

//LOGOUT ROUTES
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

/* //MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
 */
module.exports = router;