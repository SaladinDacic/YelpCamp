var Campground =    require("../models/campground");
var Comment =       require("../models/comment");




// All the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //Is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                //Does user own campground?
                if(foundCampground.author.id.equals(req.user._id)){ // Ispituje da li je autor campgrounda jednak sa trenutim user-om
                    next();
                }else{
                    //otherwise, redirect..
                    req.flash("error", "You don't have premission to do that!");
                    res.redirect("back");
                }
            };
        });
    }else{
        //otherwise, redirect..
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    };
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //Is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                //Does user own comment?
                if(foundComment.author.id.equals(req.user._id)){ // Ispituje da li je autor campgrounda jednak sa trenutim user-om
                    next();
                }else{
                    //otherwise, redirect..
                    req.flash("error", "You don't have premission to do that!");
                    res.redirect("back");
                }
            };
        });
    }else{
        //otherwise, redirect..
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    };
};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;
