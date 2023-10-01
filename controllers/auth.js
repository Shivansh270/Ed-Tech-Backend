const OTP = require("../models/Otp");
const User = require("../models/User");
var otpGenerator = requore("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//send otp code
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ emial });
    if (checkUserPresent) {
      return res.status(401).json({
        message: "user already exist",
      });
    }
    //generate otp
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });
    console.log("otp generated: ", otp);

    //check unique otp or not
    const uniqueOtp = await OTP.findOne({ otp: otp });

    while (uniqueOtp) {
      uniqueOtp = otpGenerator;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        speciaChars: false,
      });
      uniqueOtp = await OTP.findOne({ otp: otp });
    }

    //create new entry in db
    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      message: "otp sent sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to send otp",
    });
  }
};

//signup

exports.signup = async (res, req) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All the fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All the fields are required",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exist",
      });
    }

    //find most recent otp stored for the user
    const recentOtp = await OTP.find({ emial }).sort({ created: -1 }).limit(1);
    console.log(recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      return res.status(405).json({
        success: false,
        message: "Enter Otp",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(405).json({
        success: false,
        message: "Invalid Otp",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "hash failed",
      });
    }
    const profileDetails = await User.create({
      gender,
      dateOfBirth,
      about,
      contactNumber,
    });

    const user = User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User is registered sucessfiully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "registation unsucessful",
    });
  }
};

//LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "Fill all the details",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Please signup first",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    //verify password and generate a jwt tokem
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      user.token = token;
      user.password = password;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        HTMLOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "login successful",
      });
    } else {
      return res.status(501).json({
        success: false,
        message: "Password is incorrect ",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "error while login",
    });
  }
};

//change password
exports.changePassword = async (res, req) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!password || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(402).json({
        success: false,
        message: "Password does not match",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    await mailSender(email, "Password change", "Password change is sucessful");

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      HTMLOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
