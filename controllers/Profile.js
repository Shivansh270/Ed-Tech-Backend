const { findById } = require("../models/Otp");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.upateProfile = async (req, res) => {
  try {
    const { gender, about, contactNumber = "", dateOfBirth = "" } = req.body; //get user id
    const id = req.user.id;

    if (!gender || !about || !id) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profileid = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileid);

    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile details updated sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "falied to update details",
      error: error.message,
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "No profile found",
      });
    }
    //elete profile details
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Profile deleted sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "falied to delete details",
      error: error.message,
    });
  }
};
