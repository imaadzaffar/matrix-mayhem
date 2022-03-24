const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  score: { type: String, required: true },
  timeTaken: { type: Number, required: true },
});

module.exports = mongoose.model("Result", resultSchema);
