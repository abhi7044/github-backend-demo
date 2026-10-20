const express = require("express");
const repoController = require("../controller/repoController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorizeMiddleware");

const repoRouter = express.Router();

repoRouter.post("/create", authMiddleware, repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/user/:userId", repoController.fetchRepositoriesForCurrentUser);
repoRouter.get("/:id", repoController.fetchRepositoryById);
repoRouter.put("/update/:id", authMiddleware, authorizeMiddleware, repoController.updateRepositoryById);
repoRouter.patch("/toggle/:id", authMiddleware, authorizeMiddleware, repoController.toggleVisibilityById);
repoRouter.delete("/delete/:id", authMiddleware, authorizeMiddleware, repoController.deleteRepositoryById);


module.exports = repoRouter;