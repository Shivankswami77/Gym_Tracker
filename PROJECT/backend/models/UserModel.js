const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },

    age: { type: String, required: false },
    gender: { type: String, required: false },
    weight: { type: String, required: false },
    height: { type: String, required: false },
    bmi: { type: String, required: false },
    profilePicture: String,
    isAdmin: { type: Boolean, default: false, required: false },
    isCoach: { type: Boolean, default: false, required: false },
    isDoctor: { type: Boolean, default: false, required: false },
    isCustomer: { type: Boolean, default: false, required: false },

    photo: {
      type: String,
      required: false,
    },
    specialization: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    num: {
      type: String,
      required: false,
    },
    timings: {
      type: Array,
      required: false,
    },
    username: {
      type: String,
      require: [false, "Please provide unique Username"],
    },

    password: {
      type: String,
      required: [false, "Please provide a password"],
      unique: false,
    },

    email: {
      type: String,
      require: [false, "Please provide a unique email"],
      unique: [true, "Already an account is exists with email"],
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },
    phone: {
      type: String,
      require: false,
    },
    address: {
      type: String,
    },

    profile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
