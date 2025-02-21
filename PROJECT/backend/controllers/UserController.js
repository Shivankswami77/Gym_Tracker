const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");

const generateToken = require("../util.js");
const signin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
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
  try {
    const users = await User.find({}, "-password"); // Exclude password

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

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = {
  signin,
  getAllUsers,
};
