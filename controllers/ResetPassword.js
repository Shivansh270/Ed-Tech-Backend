const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (res, req) => {
  try {
    const email = req.body;

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //generate tokrn for mail
    const token = crypto.randomUUID();
    //create an updated document
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      }
    );

    const url = `http://localhost3000/update-password/${token}`;

    //send mail
    await mailSender(
      email,
      "Password Reset Link",
      `Password reset link: ${url}`
    );
    return res.status(200).json({
      success: true,
      message: "Password changed email sent sucessfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Error while changing password",
      });
    }

    //find detatails
    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User details not found",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token, password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password reset sucessful",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Password reset Failed",
    });
  }
};
