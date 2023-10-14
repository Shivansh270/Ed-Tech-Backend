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
      const uid = mongoose.Types.ObjectId(user_id);
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
      notes: {
        CourseId: course_id,
        user_id,
      },
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

//verify signature controller

exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === signature) {
      console.log("Payment is authorized");

      const { course_id, user_id } = req.body.payment.payload.entity.notes;

      try {
        //find the course and update the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          course_id,
          { $push: { studentsEnrolled: user_id } },
          { new: true }
        );

        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: "falied to find course",
            error: error.message,
          });
        }

        //update course in student object
        const enrolledStudent = await User.findOneAndUpdate(
          user_id,
          {
            $push: { courses: course_id },
          },
          { new: true }
        );
        if (!enrolledStudent) {
          return res.status(500).json({
            success: false,
            message: "falied to find student",
            error: error.message,
          });
        }

        const emailResponse = await mailSender(
          enrolledStudent.email,
          "congo",
          "sucess on buying"
        );
      } catch (error) {}
    }
  } catch (error) {}
};
