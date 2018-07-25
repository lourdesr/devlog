const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
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

module.exports = router;
