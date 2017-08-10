const express = require('express'),
  router      = express.Router(),
  passport    = require('passport'),
  User        = require('../models/user')

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  let newUser = {
    username: req.body.username
  };
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      return res.render('auth/signup', {error: err.message});
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  })
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successFlash: 'Welcome',
    failureFlash: 'Invalid Username or Password',
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out')
  res.redirect('/');
})


module.exports = router;