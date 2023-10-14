const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RaitingAndReview = require("../models/RaitingAndReview");

//craete rating

exports.createRating = async (req, res) => {
  try {
    const { raiting, review, courseId } = req.body;

    const userId = req.user.id;

    //check if user already enrolled or not
    const alreadyEnrolled = await Course.findOne({
      courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    //if already raited
    const alreadyReviewed = await RaitingAndReviews.findOne(courseId, userId);

    if (alreadyReviewed) {
      return res.status(401).json({
        success: false,
        message: "User has already reviewed",
      });
    }

    //create a new raiting
    const newReview = await RaitingAndReviews.create({
      raiting,
      review,
      user: userId,
    });

    //update raiting and review in course array
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { raitingAndReviews: newReview._id },
      },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get average raiting
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RaitingAndReview.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$raiting" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Average rating is 0, no ratings given so far",
        averageRating: 0,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all raiting
exports.getAllRaiting = async (req, res) => {
  try {
    const allReviews = await RaitingAndReview.find({})
      .sort({
        raiting: "desc",
      })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched sucessfully",
      allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
