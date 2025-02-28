const express = require("express");
const workoutRouter = express.Router();
const controller = require("../../controllers/WorkoutController");
workoutRouter.route("/workouts").get(controller.getCustomizedWorkoutPlan);
workoutRouter.route("/add-custom-workout").post(controller.addCustomWorkout);
workoutRouter
  .route("/delete-custom-workout/:id")
  .delete(controller.deleteCustomAddedWorkout);

module.exports = workoutRouter;
