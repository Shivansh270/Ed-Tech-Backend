const mongoose = require("mongoose");

const course = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
    required: true,
  },
  courseDescription: {
    type: String,
    trim: true,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn: {
    type: String,
    trim: true,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  raitingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RaitingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  tag: {
    type: [String],
    required: true,
  },

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: [String],
    enum: ["Draft", "Published"],
  },
});

module.exports = mongoose.model("Courses", course);
