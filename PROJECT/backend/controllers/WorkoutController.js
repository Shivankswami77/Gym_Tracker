const Workout = require("../models/workoutModel.js");

// Endpoint: GET /exercises
const getCustomizedWorkoutPlan = async (req, res) => {
  let { search, type, level, equipment, bodyPart, page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  // Construct query object dynamically using schema fields.
  let queryObj = {};

  if (type) {
    queryObj.Type = { $regex: new RegExp(type, "i") }; // No anchors for partial match
  }
  if (level) {
    queryObj.Level = { $regex: new RegExp(level, "i") };
  }
  if (equipment) {
    queryObj.Equipment = { $regex: new RegExp(equipment, "i") };
  }
  if (bodyPart) {
    queryObj.BodyPart = { $regex: new RegExp(bodyPart, "i") };
  }
  if (search) {
    queryObj.$or = [
      { Title: { $regex: new RegExp(search, "i") } },
      { Desc: { $regex: new RegExp(search, "i") } },
    ];
  }

  const total = await Workout.countDocuments(queryObj);
  const results = await Workout.find(queryObj)
    .sort({ createdDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    results,
  });
};
const addCustomWorkout = async (req, res) => {
  // Destructure properties from req.body
  const { Title, Level, Equipment, BodyPart } = req.body;

  // Check if Title is provided
  if (!Title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Create a new workout using the provided values
  const newCustomWorkout = new Workout({
    Title,
    Level,
    Equipment,
    BodyPart,
    isCustomWorkout: true,
  });

  // Check if the workout already exists
  const workoutAlreadyExists = await Workout.findOne({ Title });
  if (workoutAlreadyExists) {
    return res.status(409).json({ message: "Workout Already Exists" });
  }

  try {
    const savedWorkout = await newCustomWorkout.save();
    res.status(200).json({
      message: "Workout added successfully",
      workout: savedWorkout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const deleteCustomAddedWorkout = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (!workout.isCustomWorkout) {
      return res.status(403).json({
        message: "Deletion not allowed. Only custom workouts can be deleted.",
      });
    }

    // Delete the workout
    await Workout.findByIdAndDelete(id);
    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
module.exports = {
  getCustomizedWorkoutPlan,
  addCustomWorkout,
  deleteCustomAddedWorkout,
};
