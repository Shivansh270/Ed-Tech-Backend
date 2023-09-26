const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: date,
    default: Date.now(),
    expire: 5 * 60,
  },
});

const sendVeificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification code from Studyzone",
      otp
    );
    console.log("Mail sent sucessfully", mailResponse);
  } catch (error) {
    console.log(("Error in seding otp: ", error));
  }
};

OTPSchema.pre("save", async (next) => {
  await sendVeificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
