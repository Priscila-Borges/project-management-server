const router = require("express").Router();

const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");


//  POST /api/projects  -  Creates a new project
router.post("/projects", isAuthenticated, (req, res, next) => {
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
      });
    });
});



//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/projects/:projectId', isAuthenticated, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  // Each Project document has a `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Project.findById(projectId)
    .populate('tasks')
    .then(project => res.json(project))
    .catch(err => {
      console.log("...", err);
      res.status(500).json({
        message: "Error getting project details",        
      });
    });
});


// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put('/projects/:projectId', isAuthenticated,(req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const newDetails = {
    title: req.body.title,
    description: req.body.description,
    tasks: req.body.tasks
  }

  Project.findByIdAndUpdate(projectId, newDetails, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch(err => {
      console.log("Error updating project", err);
      res.status(500).json({
        message: "Error updating project",        
      });
    })
});


// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete('/projects/:projectId', isAuthenticated, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
    .catch(err => {
      console.log("error deleting project", err);
      res.status(500).json({
        message: "error deleting project",        
      });
    })
});



module.exports = router;
