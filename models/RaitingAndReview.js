const mongoose = require("mongoose");

const raitingAndReview = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  raiting: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("RaitingAndReview", raitingAndReview);
