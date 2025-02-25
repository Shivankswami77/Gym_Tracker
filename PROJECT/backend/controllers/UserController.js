const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");

const generateToken = require("../util.js");
const signin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const roleMappings = {
        isAdmin: "Admin",
        isCoach: "Coach",
        isDoctor: "Doctor",
        isCustomer: "Customer",
      };

      let userRole =
        Object.keys(roleMappings).find((key) => user[key]) || "isCustomer";
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: { [userRole]: true }, // Only one role will be true
        roleType: roleMappings[userRole], // Single role name
        token: generateToken(user),
        address: user.address,
        age: user.age,
        phone: user.phone,
        gender: user.gender,
        bmi: user.bmi,
        height: user.height,
        weight: user.weight,
        profilePicture: user.profilePicture,
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
};

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const users = await User.find({}, "-password")
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(limit) // Limit the number of documents
      .lean(); // Exclude password
    const totalUsers = await User.find({}, "-password").countDocuments();
    const roleMappings = {
      isAdmin: "Admin",
      isCoach: "Coach",
      isDoctor: "Doctor",
      isCustomer: "Customer",
    };

    const formattedUsers = users.map((user) => {
      const userRole =
        Object.keys(roleMappings).find((key) => user[key]) || "isCustomer";

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: { [userRole]: true },
        roleType: roleMappings[userRole],
        address: user.address,
        age: user.age,
        phone: user.phone,
        gender: user.gender,
        bmi: user.bmi,
        height: user.height,
        weight: user.weight,
        profilePicture: user.profilePicture,
      };
    });

    res.status(200).json({ data: formattedUsers, totalRecords: totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  signin,
  getAllUsers,
  deleteUser,
};
