const customerModel = require("../models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const response = require("express");
const jwt = require("jsonwebtoken");
const ENV = require("../routes/customer/config.js");
const otpGenerator = require("otp-generator");
const bcryptt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
// middleware for verifyUser
const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    //  check the user existance
    let exist = await customerModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Cant find user!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication error" });
  }
};

// Auth middleware
const Auth = async (req, res, next) => {
  try {
    //access the authorized header to validate request
    const token = req.headers.authorization.split(" ")[1];

    //retrive the user details for the logged user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication Failed..!" });
  }
};

//middleware for local variables
const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

const register = async (req, res) => {
  const { name, password, profile, email } = req.body;

  const user = new customerModel({
    name: name,
    username: name,
    email: email,
    password: bcryptt.hashSync(password),
    profile: profile,
    isCustomer: true,
  });
  // Check if the user already exists in the database
  const existingUser = await customerModel.findOne({
    // $or: [{ name }, { email }],
    email,
  });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }
  try {
    await user.save();
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user._name,
        email: user.email,
        isAdmin: false,
        isCoach: false,
        isDoctor: false,
        isCustomer: true,
        token: user.token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  } catch (error) {
    console.log(error);
  }
};

const login = expressAsyncHandler((req, res) => {
  const { name, password } = req.body;

  try {
    customerModel
      .findOne({ name })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have password..!" });

            //create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                name: user.name,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Successful..!",
              name: user.name,
              token,
            });
          })
          .catch((error) => {
            return res
              .status(400)
              .send({ error: "Password does not Match..!" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Name not found..!" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** GET: http://localhost:4000/api/user/:name */

const getUser = async (req, res) => {
  const { id } = req.params;

  // Check if ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid User ID format" });
  }

  try {
    const user = await customerModel.findById(id).lean(); // .lean() for plain JSON object

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const { password, ...rest } = user;
    res.status(200).json(rest);
  } catch (error) {
    console.error("Database Error:", error); // Log the actual error
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  console.log(req.params, req.body, "DASSSSSSSSSSSSSSSS");
  try {
    const customer = await customerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  register,
  login,
  getUser,
  updateUser,
  verifyUser,
  Auth,
  localVariables,
};
