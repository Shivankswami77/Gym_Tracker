const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExerciseSchema = new Schema(
  {
    // MongoDB automatically adds an _id field of type ObjectId.

    // A numeric exercise ID, e.g., 2917
    exerciseId: { type: Number, required: false },
    isCustomWorkout: { type: Boolean, required: false, default: false },

    // Title: e.g., "30 Arms EZ-Bar Skullcrusher"
    Title: { type: String, required: true },

    // Description (optional)
    Desc: { type: String },

    // Type: e.g., "Strength"
    type: { type: String, required: false },

    // BodyPart: e.g., "Triceps"
    BodyPart: { type: String, required: false },

    // Equipment: e.g., "E-Z Curl Bar"
    Equipment: { type: String, required: false },

    // Level: e.g., "Intermediate"
    Level: { type: String, required: false },

    // Rating (optional)
    rating: { type: String },

    // Rating description (optional)
    ratingDesc: { type: String },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model(
  "workouts_data",
  ExerciseSchema,
  "workouts_data"
);
