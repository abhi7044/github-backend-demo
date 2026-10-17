const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");

async function createIssue(req, res) {
  const { title, description, repository } = req.body;
  try {
    if (!title || !title.trim() || !repository) {
      return res.status(400).json({ error: "Title and repository are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(repository)) {
      return res.status(400).json({ error: "Invalid repository id" });
    }

    const repo = await Repository.findById(repository);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const issue = await Issue.create({
      title: title.trim(),
      description: description || "",
      repository,
    });

    repo.issues.push(issue._id);
    await repo.save();

    res.status(201).json({ message: "Issue created!", issue });
  } catch (err) {
    console.error("Error during issue creation: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find({}).sort({ createdAt: -1 });
    res.json({ issues });
  } catch (err) {
    console.error("Error during fetching issues: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

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

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue id" });
    }
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({ issue });
  } catch (err) {
    console.error("Error during fetching issue: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue id" });
    }
    if (status && !["open", "closed"].includes(status)) {
      return res.status(400).json({ error: "Status must be open or closed" });
    }

    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description;
    if (status) update.status = status;

    const issue = await Issue.findByIdAndUpdate(id, update, { new: true });
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({ message: "Issue updated!", issue });
  } catch (err) {
    console.error("Error during issue update: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue id" });
    }
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    await Repository.findByIdAndUpdate(issue.repository, {
      $pull: { issues: issue._id },
    });
    res.json({ message: "Issue deleted!" });
  } catch (err) {
    console.error("Error during issue deletion: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssuesByRepo,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};