const express = require("express");

const bodyParser = require("body-parser");
const userRouter = express.Router();

userRouter.use(bodyParser.json());

var Users = require("../models/users");
var passport = require("passport");
var authenticate = require("../authenticate");
const users = require("../models/users");

userRouter.post("/signup", (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password)
    .then((user) => {
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      return user.save();
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: "Registration Successful!" });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
});

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

// userRouter.post("/signup", (req, res, next) => {
//   Users.findOne({ username: req.body.username })
//     .then((user) => {
//       if (user != null) {
//         var err = new Error("User " + req.body.username + " already exists!");
//         err.status = 403;
//         next(err);
//       } else {
//         return Users.create({
//           username: req.body.username,
//           password: req.body.password,
//         });
//       }
//     })
//     .then(
//       (user) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json({ status: "Registration Successful!", user: user });
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// });

// userRouter.post("/login", (req, res, next) => {
//   if (!req.session.user) {
//     var authHeader = req.headers.authorization;

//     if (!authHeader) {
//       var err = new Error("You are not authenticated!!!!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//     }

//     var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");
//     var username = auth[0];
//     var password = auth[1];

//     Users.findOne({ username: username })
//       .then((user) => {
//         if (user === null) {
//           var err = new Error("User " + username + " does not exist!");
//           err.status = 403;
//           return next(err);
//         } else if (user.password !== password) {
//           var err = new Error("Your password is incorrect!");
//           err.status = 403;
//           return next(err);
//         } else if (user.username === username && user.password === password) {
//           req.session.user = "authenticated";
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "text/plain");
//           res.end("You are authenticated!");
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("You are already authenticated!");
//   }
// });

userRouter.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
module.exports = userRouter;
