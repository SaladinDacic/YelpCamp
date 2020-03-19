var express =           require("express");
var router  =           express.Router({mergeParams: true});
var Campground =        require("../models/campground");
var Comment =           require("../models/comment");
var middleware =        require("../middleware/index");


// COMMENTS ROUTES !!!
router.get("/new", middleware.isLoggedIn, function(req, res){
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{ 
            res.render("comments/new", {campground: campground});
        }
    });
});

//.........................................................................................................................................
//.........................................................................................................................................

router.post("/", middleware.isLoggedIn, function(req, res){
    //Lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //and now save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page 
                    req.flash("success", "You successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                };
            });
        }
    });
});

//.........................................................................................................................................
//.........................................................................................................................................
//Comment EDit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership , function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});  
        }
    });
});

//.........................................................................................................................................
//.........................................................................................................................................
//Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "You successfully updated comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//.........................................................................................................................................
//.........................................................................................................................................
//Comment Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "You successfully deleted comment!");
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});








//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................

module.exports = router;