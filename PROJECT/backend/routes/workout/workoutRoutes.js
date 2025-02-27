const express = require("express");
const workoutRouter = express.Router();
const controller = require("../../controllers/WorkoutController");
workoutRouter.route("/workouts").get(controller.getCustomizedWorkoutPlan); //login in app

module.exports = workoutRouter;
