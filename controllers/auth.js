const OTP = require("../models/Otp");
const user = require("../models/User");
var otpGenerator = requore("otp-generator");

//send otp code
exports.otp = async (req, res) => {
  try {
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await user.findOne({ emial });
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
    const existingUser = await user.findOne({ email });

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
    } else if (opt !== recentOtp.otp) {
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
    const profileDetails = await user.create({
      gender,
      dateOfBirth,
      about,
      contactNumber,
    });

    const user = user.create({
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
