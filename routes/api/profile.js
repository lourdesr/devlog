const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');


router.get("/test", (req, res) => {
  res.json({
    msg: "Profile Works"
  });
});


// @route GET api/profile
// @desc Get Current User Profile
// @access Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


module.exports = router;
