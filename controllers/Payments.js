const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const { mailSender } = require("../utils/mailSender");
const mongoose = require("mongoose");

exports.capturePayment = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    //validate course id
    if (!course_id) {
      return res.status(500).json({
        success: false,
        message: "Course id not found",
      });
    }

    //validate course detail
    let course;
    try {
      course = await User.findById(course_id);
      if (!course) {
        return res.status(501).json({
          success: false,
          message: "Course not found",
        });
      }

      //user already has the same course
      const uid = mongoose.Schema.Types.ObjectId(user_id);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(502).json({
          success: false,
          message: "Student already enrolled at this course",
        });
      }
    } catch (error) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }

    //create order
    const price = course.price;
    const currency = "INR";

    const options = {
      amount: price * 100,
      currency: currency,
      recipt: Math.random(Date.now()),
    };

    //create function
    try {
      const createOder = await instance.orders.create(options);
      console.log(createOder);

      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        amount: createOder.amount,
        course_id: createOder.id,
        message: "order created sucessfully",
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(504).json({
      success: false,
      message: error.message,
    });
  }
};
