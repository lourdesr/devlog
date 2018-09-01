const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const AUTHSECRET = require("../../config/keys").authSecret;

const router = express.Router();

//Load User Validations
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

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
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json({ errors });
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
  const { errors, isValid } = validateLoginInput(req.body);
  console.log(isValid);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      res.status(404).json({ errors });
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
        errors.password = "Invalid Login Credentials";
        return res.status(400).json({ errors });
      }
    });
  });
});

//@route    GET/api/users/current
//@desc     Gets the Current User
//@access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  }
);

module.exports = router;