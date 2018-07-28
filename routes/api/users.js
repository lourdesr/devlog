const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const AUTHSECRET = require("../../config/keys").authSecret;

const router = express.Router();

//Load User Model
const User = require("../../models/User");

//@route    GET/api/users/test
//@desc     Test User Routes
//@access   Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Users Works"
  });
});

//@route    GET/api/users/register
//@desc     Register Users
//@access   Public

router.post("/register", (req, res) => {
  // console.log(req.body.name);
  // console.log(req.body.email);
  // console.log(req.body.password);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Already Exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route    GET/api/users/login
//@desc     Login Users
//@access   Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      //returns a bool values in isMatch
      if (isMatch) {
        //User matched
        //res.json({ msg: "Success" });
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        jwt.sign(payload, AUTHSECRET, { expiresIn: 3600 }, (err, token) => {
          //
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        //Incorrect Password
        return res.status(400).json({ password: "Invalid Login Credentials" });
      }
    });
  });
});

//@route    GET/api/users/current
//@desc     Return Current Users
//@access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Success" });
  }
);

module.exports = router;
