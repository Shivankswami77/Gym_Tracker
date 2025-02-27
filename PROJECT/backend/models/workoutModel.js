const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExerciseSchema = new Schema(
  {
    // MongoDB automatically adds an _id field of type ObjectId.

    // A numeric exercise ID, e.g., 2917
    exerciseId: { type: Number, required: true, unique: true },

    // Title: e.g., "30 Arms EZ-Bar Skullcrusher"
    title: { type: String, required: true },

    // Description (optional)
    desc: { type: String },

    // Type: e.g., "Strength"
    type: { type: String, required: true },

    // BodyPart: e.g., "Triceps"
    bodyPart: { type: String, required: true },

    // Equipment: e.g., "E-Z Curl Bar"
    equipment: { type: String, required: true },

    // Level: e.g., "Intermediate"
    level: { type: String, required: true },

    // Rating (optional)
    rating: { type: String },

    // Rating description (optional)
    ratingDesc: { type: String },
  },
  { timestamps: true } // Optional: adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model(
  "workouts_data",
  ExerciseSchema,
  "workouts_data"
);
