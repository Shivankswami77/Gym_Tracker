const express = require("express");
const workoutRouter = express.Router();
const controller = require("../../controllers/WorkoutController");
workoutRouter.route("/workouts").get(controller.getCustomizedWorkoutPlan);
workoutRouter
  .route("/user-workout-plan/:id")
  .get(controller.getUserWorkoutPlanByUserId);
workoutRouter.post("/workout-plans/submit", controller.submitCompletedWorkouts);
workoutRouter.route("/add-custom-workout").post(controller.addCustomWorkout);
workoutRouter
  .route("/delete-custom-workout/:id")
  .delete(controller.deleteCustomAddedWorkout);
workoutRouter
  .route("/assign-workout-plan/:id")
  .post(controller.assignWorkoutPlanToUser)
  .put(controller.assignWorkoutPlanToUser);

module.exports = workoutRouter;
