const Tag = require("../models/Tag");

exports.cerateTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(401).json({
        success: "false",
        message: "All fields are required",
      });
    }

    const newTag = await Tag.create({ name, description });

    return res.status(200).json({
      success: "true",
      message: "Tag created sucessfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};

//get all tags
exports.getAllTags = async (req, res) => {
  try {
    const getAllTags = await Tag.find({}, { name: true, description: true });

    return res.status(20).json({
      success: "true",
      message: "All Tag returned sucessfully",
      getAllTags,
    });
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};
