const mongoose = require("mongoose");

const raitingAndReview = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  raiting: {
    type: string,
    required: true,
  },
  review: {
    type: string,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("RaitingAndReview", raitingAndReview);
