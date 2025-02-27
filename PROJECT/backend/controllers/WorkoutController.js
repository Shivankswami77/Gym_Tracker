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
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    results,
  });
};

module.exports = {
  getCustomizedWorkoutPlan,
};
