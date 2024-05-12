const express = require("express");
const verifyToken = require("../middleware/authenticate");
const { addBoard } = require("../controllers/board");
const { addProject, deleteProject, editProjectInfo } = require("../controllers/project");
const { addIssue } = require("../controllers/issueType");
const { addPriorityType } = require("../controllers/priorityType");
const { addStatus } = require("../controllers/status");
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


module.exports = router;