const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.subSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;

    const videoUrl = req.files.videoUrl;

    if (!title || !timeDuration || !description || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //upload video file
    const thumbnailVideo = await uploadImageToCloudinary(
      videoUrl,
      process.env.FOLDER_NAME
    );

    //create subSection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: thumbnailVideo.secure_url,
    });

    //update the section database
    await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Sub Section created sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update subSection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    const videoUrl = req.files.videoUrl;

    if (!subSectionId || !title || !timeDuration || !description || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await SubSection.findByIdAndUpdate(
      subSectionId,
      { title, timeDuration, description },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "SUB Section updated sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DELETE SUBSECTION
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.body;
    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(202).json({
      success: true,
      message: "Sub Section deleted sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
