const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.userSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: "User already exists with this email",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              schoolYear: req.body.schoolYear,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "Successfully created user",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Authentication successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Authentication failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
};

exports.userDelete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Successfully deleted user",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};