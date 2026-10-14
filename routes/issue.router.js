const express = require("express");
const issueController = require("../controller/issueController");

const issueRouter = express.Router();


issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.get("/issue/:id", issueController.getIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);

module.exports = issueRouter;