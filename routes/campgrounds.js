const express     = require('express'),
  router          = express.Router(),
  Camp            = require('../models/campgrounds'),
  Comment         = require("../models/comments"),
  isLogged        = require("../middleware").isLogged,
  checkCampOwner  = require("../middleware").checkCampOwner;

//Campground New page
router.get('/campgrounds/new', isLogged, (req, res) => {
  res.render('campground/new');
});

// Show all campgrounds
router.get('/campgrounds', (req, res) => {
  Camp.find((err, camps) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('campground/campgrounds', {
        campgrounds: camps
      });
    }
  })
});

// Add a new Campground
router.post('/campgrounds', isLogged, (req, res) => {
  console.log(req.user);
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newcamp = new Camp({
    name: req.body.campname,
    image: req.body.image,
    description: req.body.desc,
    author: author
  });
  newcamp.save();
  res.redirect('/campgrounds');
});

// Show a particular campground
router.get('/campgrounds/:id', (req, res) => {
  Camp.findById(req.params.id).populate('comments').exec((err, foundcamp) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('campground/show', {
        campground: foundcamp
      });
    }
  });
});

// Show the edit form for the campground
router.get('/campgrounds/:id/edit', checkCampOwner, (req, res) => {
  Camp.findById(req.params.id, (err, foundcamp) => {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds/' + req.params.id )
    } else {
      res.render('campground/edit', { campground: foundcamp });
    }
  })
});

// Update the campground
router.put('/campgrounds/:id', checkCampOwner, (req, res) => {
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// Delete the campground
router.delete('/campgrounds/:id', checkCampOwner, (req, res)=> {
  Camp.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
    } else {
      camp.remove((err, camp) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/campgrounds');
        }
      })
    }
  });
});

module.exports = router;
