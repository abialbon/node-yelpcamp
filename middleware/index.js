const Camp = require("../models/campgrounds");
const Comment = require("../models/comments");

const middleware = {};

middleware.isLogged = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error', 'You need to be logged in!');
    res.redirect('/login');
  }
};

middleware.checkCampOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        console.log(err)
      } else if (foundCamp.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', 'You do not have permission to do that!');
        res.redirect('/campgrounds/' + req.params.id);
      }
    })
  } else {
    req.flash('error', 'You need to be logged in!');
    res.redirect('back')
  }
}

middleware.checkCommentOwner = function(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.id, (err, comment) => {
      if(err) {
        console.log(err);
        res.redirect('/campgrounds/' + req.params.campid);
      } else {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that!');
          res.redirect('/campgrounds/' + req.params.campid);
        }
      }
    })
  } else {
    req.flash('error', 'You need to be logged in!');
    res.redirect('back');
  }
}

module.exports = middleware;