const express = require("express");
const issueController = require("../controller/issueController");

const issueRouter = express.Router();


issueRouter.post("/create", issueController.createIssue);
issueRouter.get("/all", issueController.getAllIssues);
issueRouter.put("/update/:id", issueController.updateIssueById);
issueRouter.get("/repo/:repoId", issueController.getIssuesByRepo);
issueRouter.get("/:id", issueController.getIssueById);
issueRouter.delete("/delete/:id", issueController.deleteIssueById);

module.exports = issueRouter;