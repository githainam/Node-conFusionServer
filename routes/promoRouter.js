const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Promotions = require("../models/promotions");
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promotion) => {
          console.log("promotion created", promotion);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Promotions");
  })
  .delete((req, res, next) => {
    Promotions.remove({})
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

// Create, Read, Delete by promotionId

promoRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Promotions" + req.params.promotionId);
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
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

module.exports = promoRouter;
    