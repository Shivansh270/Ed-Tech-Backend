const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(401).json({
        success: "false",
        message: "All fields are required",
      });
    }

    const newCategory = await Category.create({ name, description });

    return res.status(200).json({
      success: "true",
      message: "Category created sucessfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};

//get all Category
exports.getAllCategory = async (req, res) => {
  try {
    const getAllCategory = await Category.find(
      {},
      { name: true, description: true }
    );

    return res.status(20).json({
      success: "true",
      message: "All Category returned sucessfully",
      getAllCategory,
    });
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};

//category page details controller

exports.createCategoryDetails = async (req, res) => {
  try {
  } catch (error) {}
};
