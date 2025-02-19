const User = require("../models/UserModel.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const generateToken = require("../util.js");
const signin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isCoach: user.isCoach,
        isDoctor: user.isDoctor,
        isCustomer: user.isCustomer,
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

module.exports = {
  signin,
};
