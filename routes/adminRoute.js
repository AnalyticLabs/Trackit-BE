const express = require("express");
const verifyToken = require("../middleware/authenticate");
const { addBoard } = require("../controllers/board");
const { addProject, deleteProject, editProjectInfo } = require("../controllers/project");
const { addIssue } = require("../controllers/issueType");
const { addPriorityType } = require("../controllers/priorityType");
const { addStatus } = require("../controllers/status");
const { createSprint, editSprint, markComplete } = require("../controllers/sprint");
const router = express.Router();

// project Route
router.route("/add-project").post(verifyToken, addProject);
router.route("/delete-project").get(verifyToken, deleteProject);
router.route("/edit-project").post(verifyToken, editProjectInfo);

// Settings Page Route
router.route('/add-board').post(verifyToken,addBoard)
router.route('/add-issue-types').post(verifyToken,addIssue)
router.route('/add-priority-types').post(verifyToken,addPriorityType)
router.route('/add-status').post(verifyToken,addStatus)

//sprint routes
router.route('/create-sprint').post(verifyToken,createSprint)
router.route('/edit-sprint').post(verifyToken,editSprint)
router.route('/mark-complete').post(verifyToken,markComplete)


module.exports = router;