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
exports.showAllCategories = async (req, res) => {
  try {
    const getAllCategory = await Category.find(
      {},
      { name: true, description: true }
    );

    return res.status(200).json({
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

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Course.findById(categoryId)
      .populate("course")
      .exec();

    //validation
    if (!selectedCategory) {
      return res.status(400).json({
        success: "false",
        message: error.message,
      });
    }

    //courses with different category
    const differentCourses = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("course")
      .exec();

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCourses,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};
