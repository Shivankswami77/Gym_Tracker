const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkoutPlanItemSchema = new Schema({
  isCustomWorkout: { type: Boolean, default: false },
  exerciseId: { type: Number }, // master workout ID, for example
  Title: { type: String, required: true },
  Desc: { type: String },
  Type: { type: String },
  BodyPart: { type: String },
  Equipment: { type: String },
  Level: { type: String },
  Rating: { type: String },
  RatingDesc: { type: String },
  sets: { type: Number },
  reps: { type: Number },
  waitTime: { type: Number },
});

const WorkoutPlanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    Monday: { type: [WorkoutPlanItemSchema], default: [] },
    Tuesday: { type: [WorkoutPlanItemSchema], default: [] },
    Wednesday: { type: [WorkoutPlanItemSchema], default: [] },
    Thursday: { type: [WorkoutPlanItemSchema], default: [] },
    Friday: { type: [WorkoutPlanItemSchema], default: [] },
    Saturday: { type: [WorkoutPlanItemSchema], default: [] },
    Sunday: { type: [WorkoutPlanItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
