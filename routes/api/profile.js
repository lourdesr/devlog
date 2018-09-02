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

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {

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

// @route GET api/profile
// @desc Create or Edit User Profile
// @access Private

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  //Skills - Split into Array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(",");
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;


  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }).then(profile => res.json(profile));
      }
      else {
        //Create

        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          //Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        })
      }
    }).catch(err => { console.log(err); });


});



module.exports = router;
