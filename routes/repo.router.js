const express = require("express");
const repoController = require("../controller/repoController");

const repoRouter = express.Router();

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/user/:userId", repoController.fetchRepositoriesForCurrentUser);
repoRouter.get("/:id", repoController.fetchRepositoryById);
repoRouter.put("/update/:id", repoController.updateRepositoryById);
repoRouter.patch("/toggle/:id", repoController.toggleVisibilityById);
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;