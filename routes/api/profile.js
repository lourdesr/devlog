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

router.get("/userprofile", passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      return res.status(404).json({ error: "No Profile Found" });
    }
    else {
      res.json(profile);
    }
  }).catch(err => {
    console.log(err);
  })
});

module.exports = router;
