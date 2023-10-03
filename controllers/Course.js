const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tag");
const { cerateTag } = require("../controllers/Tag");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, price, whatYouWillLearn, tag } =
      req.body;

    const thumbnail = req.files.thumbnailImage;
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatYouWillLearn ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor as we have to update the course in the instructor object

    //user id of the instructor
    const userId = req.user.id;
    //object id of the instructor
    const instructorDetails = await User.findById(userId);
    console.log("Instructor details: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    //verify tag
    const tagDetail = await Tag.findById(tag);
    if (!tagDetail) {
      return res.status(402).json({
        success: false,
        message: "Tag details not found",
      });
    }

    //Uplaoad image
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create a new course and save to DB
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      instructor: instructorDetails._id,
      tag: tagDetail._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //update user object(instructor)
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update tag schema
    await Tag.findByIdAndUpdate(
      { _id: tagDetail._id },
      { $push: { course: cerateTag._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Course cannot be created",
    });
  }
};

//get all course

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        whatYouWillLearn: true,
        instructor: true,
        raitingAndReviews: true,
        thumbnail: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      message: "All Course fetched sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      allCourses,
    });
  }
};
