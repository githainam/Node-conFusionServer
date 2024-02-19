const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Leaders = require("../models/leaders");
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          console.log("leader created", leader);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Leaders");
  })
  .delete((req, res, next) => {
    Leaders.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// Create, Read, Delete by leaderId

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Leaders" + req.params.leaderId);
  })
  .delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
    