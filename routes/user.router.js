const express = require("express");
const userController = require("../controller/userController");

const userRouter = express.Router();


userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.post("/star/:userId/:repoId", userController.toggleStarRepo);
userRouter.get("/starred/:userId", userController.getStarredRepos);

module.exports = userRouter;