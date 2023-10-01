const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookie.token ||
      req.header("Authorization").replace("bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token not verified",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//authorization for student

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(402).json({
        success: false,
        message: "protected route for student",
      });
    }
    next();
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: "accountType is not matching",
    });
  }
};

//authorization
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(402).json({
        success: false,
        message: "not protected route for admin",
      });
    }
    next();
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: "accountType is not matching",
    });
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(402).json({
        success: false,
        message: "not protected route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: "accountType is not matching",
    });
  }
};
