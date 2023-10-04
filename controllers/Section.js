const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const newSection = await Section.create({ sectionName });

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate("courseContent")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Section created sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update section

exports.updateSction = async (req, res) => {
  try {
    const { sectionName, SectionId } = req.body;

    if (!sectionName || !SectionId) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    //update section
    await Section.findByIdAndUpdate(SectionId, { sectionName }, { new: true });
    return res.status(201).json({
      success: true,
      message: "Section updated sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    const { SectionId } = req.body;

    await Section.findByIdAndDelete(SectionId);
    return res.status(202).json({
      success: true,
      message: "Section deleted sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
