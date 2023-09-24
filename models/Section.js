const mongoose = require("mongoose");

const section = new mongoose.Schema({
  sectionName: {
    typr: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("Section", section);
