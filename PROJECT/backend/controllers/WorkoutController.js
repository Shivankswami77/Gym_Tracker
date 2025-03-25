const UserWorkoutPlanModel = require("../models/UserWorkoutPlanModel.js");
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

const assignWorkoutPlanToUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    // Expect the request body to include the userId and arrays for each day.
    const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } =
      req.body.assignedWorkouts;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Build the workout plan document.
    const workoutPlanData = {
      user: userId,
      Monday: Monday || [],
      Tuesday: Tuesday || [],
      Wednesday: Wednesday || [],
      Thursday: Thursday || [],
      Friday: Friday || [],
      Saturday: Saturday || [],
      Sunday: Sunday || [],
    };

    // Optionally, check if the user already has a plan and update it instead.
    // Here we simply create a new plan.
    const newPlan = new UserWorkoutPlanModel(workoutPlanData);
    const savedPlan = await newPlan.save();

    return res.status(200).json({
      message: "Workout plan assigned successfully",
      UserWorkoutPlanModel: savedPlan,
    });
  } catch (error) {
    console.error("Error assigning workout plan: ", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

const getUserWorkoutPlanByUserId = async (req, res) => {
  const { id: userId } = req.params;

  try {
    // Assuming the workout plan model has a "user" field referencing the User
    const userWorkoutPlan = await UserWorkoutPlanModel.findOne({
      user: userId,
    }).sort({ updatedAt: -1 }); // sort by updatedAt in descending order

    console.log(userWorkoutPlan, "Workout Plan for user");
    return res.status(200).json(userWorkoutPlan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
const submitCompletedWorkouts = async (req, res) => {
  const { userId, workoutPlan } = req.body;
  const completedWorkouts = workoutPlan;
  if (!userId || !completedWorkouts) {
    return res.status(400).json({
      message: "userId and completedWorkouts object are required",
    });
  }

  try {
    // Find the workout plan document for the user.
    let workoutPlan = await UserWorkoutPlanModel.findOne({ user: userId });
    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    // For each day in the submitted completedWorkouts,
    // update the "completed" flag for each workout.
    for (const day in completedWorkouts) {
      if (workoutPlan[day] && Array.isArray(workoutPlan[day])) {
        // Convert each workout document to an object if needed.
        workoutPlan[day] = workoutPlan[day].map((workout) => {
          // If the workout's _id is in the array of completed IDs for this day, mark it as completed.
          return {
            ...workout.toObject(),
            completed: completedWorkouts[day].includes(workout._id.toString()),
          };
        });
      }
    }

    // Save the updated workout plan.
    const savedPlan = await workoutPlan.save();
    return res.status(200).json({
      message: "Workout plan updated successfully",
      workoutPlan: savedPlan,
    });
  } catch (error) {
    console.error("Error updating workout plan:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
module.exports = {
  getCustomizedWorkoutPlan,
  addCustomWorkout,
  deleteCustomAddedWorkout,
  assignWorkoutPlanToUser,
  getUserWorkoutPlanByUserId,
  submitCompletedWorkouts,
};
