var express =       require("express");
var router  =       express.Router();
var Campground =    require("../models/campground");
var middleware =    require("../middleware/index");


// INDEX ROUTE ------------ SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

//.........................................................................................................................................
//.........................................................................................................................................


// CREATE ROUTE -------------- ADD NEW CAMPGROUNDS TO DATABASE
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds arr
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name,price: price, image: image, description: desc, author: author};
    // .... Create a new campground and save to database ....
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "You successfully added campground!");
            res.redirect("/campgrounds");
        };
    });
    // campgrounds.push(newCampground);
    //redirect to campgrounds route
    // res.redirect("/campgrounds");
});

// NEW ROUTE ----------- SHOW FORM TO CREATE CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});



//.........................................................................................................................................
//.........................................................................................................................................


// SHOW ROUTE ------------- SHOW MORE INFO ABOUT CAMPGROUNDS
router.get("/:id", function(req, res){
    //Find campground with provided ID
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
                if(err){
                    console.log(err);
                }else{
                    //Render sshow template with that campground
                    res.render("campgrounds/show", {campgrounds: allCampgrounds, campground: foundCampground});
                }
            });
        }
    }); 
    // res.send("This will be the show page inshallah"); 
});





//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        };
    });
});

//.........................................................................................................................................
//.........................................................................................................................................

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "You successfully updated campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//.........................................................................................................................................
//.........................................................................................................................................

// DESTROY ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            req.flash("success", "You successfully deleted campground!");
            res.redirect("/campgrounds");
        }
    });
});



//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................
//.........................................................................................................................................

module.exports = router;