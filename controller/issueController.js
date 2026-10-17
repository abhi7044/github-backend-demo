const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issues = require("../models/issueModel");


async function createIssue(req, res) {
    const { title, description, repository } = req.body;
    const { id } = req.params;

    try{
    const issue = new Issues({
        title,
        description,
        repository: id,
    });

    await issue.save();

    res.status(201).json(issue);

    }catch(err){
        console.error("Error during issue creation :", err.message);
        res.status(500).send("Server error");
    }

};

async function updateIssueById(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try{
        const issue = await Issues.findById(id);

        if(!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();

        res.json(issue, { message: "Issue updated"});
    }catch(err){
        console.error("Error during issue creation :", err.message);
        res.status(500).send("Server error");
    }
};

async function deleteIssueById(req, res) {
    const { id } = req.params;

    try{
        const issue = Issues.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        res.json({message: "Issue deleted"});
    }catch(err){
        console.error("Error during issue creation :", err.message);
        res.status(500).send("Server error");
    }
};

async function getAllIssues(req, res) {
    const { id } = req.params;

    try{
        const issues = Issues.find({ repository: id });

        if (!issues) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        res.status(200).json(issues);
    }catch(err){
        console.error("Error during issue creation :", err.message);
        res.status(500).send("Server error");
    }
};

async function getIssueById(req, res) {
    const { id } = req.params;

    try{
        const issue = await Issues.findById(id);

        if(!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

       res.json(issue);
    }catch(err){
        console.error("Error during issue creation :", err.message);
        res.status(500).send("Server error");
    }
};
async function getIssuesByRepo(req, res) {
  const { repoId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ error: "Invalid repository id" });
    }
    const issues = await Issue.find({ repository: repoId }).sort({ createdAt: -1 });
    res.json({ issues });
  } catch (err) {
    console.error("Error during fetching repo issues: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssuesByRepo,
    getIssueById
}