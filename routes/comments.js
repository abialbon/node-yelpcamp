const express       = require('express'),
  router            = express.Router(),
  Camp              = require('../models/campgrounds'),
  Comment           = require('../models/comments'),
  isLogged          = require("../middleware").isLogged,
  checkCommentOwner = require("../middleware").checkCommentOwner;

router.get('/campgrounds/:id/comments/new', isLogged, (req, res) => {
  res.render('comment/new', {
    campgroundid: req.params.id
  })
});

router.post('/:id/comment', isLogged, (req, res) => {
  var author = {
    id: req.user.id,
    username: req.user.username
  }
  Comment.create({
    text: req.body.comment,
    author: author
  }, (err, comment) => {
    if (err) {
      console.log(err);
    }
    else {
      Camp.findById(req.params.id, (err, camp) => {
        if (err) {
          console.log(err);
        }
        else {
          camp.comments.push(comment);
          camp.save((err, camp) => {
            if (err) {
              console.log(err);
            }
            else {
              res.redirect('/campgrounds/' + req.params.id);
            }
          });
        }
      })
    }
  })
});

// Edit comment
router.get('/campgrounds/:campid/comment/:id/edit', checkCommentOwner, (req, res)=> {
  Comment.findById(req.params.id, (err, comment) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comment/edit', {comment: comment, campid: req.params.campid});
    }
  })
});

router.put('/campgrounds/:campid/comment/:id', checkCommentOwner, (req, res) => {
  let updatedComment = {
    text: req.body.comment
  }
  Comment.findByIdAndUpdate(req.params.id, updatedComment, (err, comment) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.campid);
    }
  })
});

//Delete a comment
router.delete('/campgrounds/:campid/comment/:id', checkCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.id, (err, comment) => {
    if(err) {
      console.log(err);
    } else {
      Camp.findById(req.params.campid, (err, foundcamp) => {
        if(err) {
          console.log(err);
        } else {
          let idObj = { _id: req.params.id };
          let index = foundcamp.comments.indexOf(idObj);
          foundcamp.comments.splice(index, 1);
          foundcamp.save();
        }
      });
      res.redirect('/campgrounds/' + req.params.campid);
    }
  })
});

module.exports = router;