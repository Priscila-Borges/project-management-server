const router = require("express").Router();

// const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");


//  POST /api/projects  -  Creates a new project
router.post("/projects", (req, res, next) => {
    const { title, description } = req.body;

    const newProject = {
        title,
        description,
        tasks: []
    }

    Project.create(newProject)
        .then(response => res.json(response))
        .catch(err => {
            console.log("Error creating new project...", err);
            res.status(500).json({
                message: "Error creating a new project",
                error: err
            });
        });
});


// GET /api/projects -  Retrieves all of the projects
router.get('/projects', (req, res, next) => {
    Project.find()
        .populate('tasks')
        .then(allProjects => res.json(allProjects))
        .catch(err => {
            console.log("Error getting list of projects...", err);
            res.status(500).json({
                message: "Error getting list of projects",
                error: err
            });
        });
});


module.exports = router;

