const mongoose = require("mongoose");
const Repository = require("../models/repoModel");

async function authorizeMiddleware(req, res, next) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid repository ID" });
        }

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not allowed to modify this repository" });
        }

        req.repository = repository; // controller me dobara DB nahi dekhna padega
        next();
    } catch (err) {
        console.error("Authorization error : ", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = authorizeMiddleware;