const mongoose = require("mongoose");

const Result = require("../models/result");

exports.resultsCreate = (req, res, next) => {
  const result = new Result({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.userId,
    date: new Date(),
    score: req.body.score,
    timeTaken: req.body.timeTaken,
  });
  result
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Successfully created result",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.resultsGet = (req, res, next) => {
  Result.find({ user: req.params.userId })
    .select("_id date timeTaken score")
    .exec()
    .then((docs) => {
      console.log(docs);
      return res.status(200).json({
        message: "Successfully got results for user",
        user: req.params.userId,
        numResults: docs.length,
        results: docs.map((doc) => ({
          id: doc._id,
          date: doc.date,
          timeTaken: doc.timeTaken,
          score: doc.score,
        })),
        request: {
          type: "GET",
          url: req.get("host") + "/results/" + req.params.userId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.message,
      });
    });
};
