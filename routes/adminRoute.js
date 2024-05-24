const express = require("express");
const verifyToken = require("../middleware/authenticate");
const { addBoard, deleteBoard } = require("../controllers/board");
const { addProject, deleteProject, editProjectInfo } = require("../controllers/project");
const { addIssue, deleteIssue } = require("../controllers/issueType");
const { addPriorityType, deletePriority } = require("../controllers/priorityType");
const { addStatus, deleteStatus } = require("../controllers/status");
const { createSprint, editSprint, markComplete } = require("../controllers/sprint");
const { createEpic, createStory, createTask, UsedDataInfo, getTask, addLinkedTask, addStory, mail } = require("../controllers/task");
const router = express.Router();

// project Route
router.route("/add-project").post(verifyToken, addProject);
router.route("/delete-project").get(verifyToken, deleteProject);
router.route("/edit-project").post(verifyToken, editProjectInfo);

// Settings Page Route
router.route('/add-board').post(verifyToken,addBoard)
router.route('/delete-board').post(verifyToken,deleteBoard)
router.route('/add-issue-types').post(verifyToken,addIssue)
router.route('/delete-issue-types').post(verifyToken,deleteIssue)
router.route('/add-priority-types').post(verifyToken,addPriorityType)
router.route('/delete-priority-types').post(verifyToken,deletePriority)
router.route('/add-status').post(verifyToken,addStatus)
router.route('/delete-status').post(verifyToken,deleteStatus)
router.route('/used-data-info').get(verifyToken,UsedDataInfo)

//sprint routes
router.route('/create-sprint').post(verifyToken,createSprint)
router.route('/edit-sprint').post(verifyToken,editSprint)
router.route('/mark-complete').post(verifyToken,markComplete)

//Tasks Routes
router.route('/create-epic').post(verifyToken,createEpic)
router.route('/create-story').post(verifyToken,createStory)
router.route('/create-task').post(verifyToken,createTask)
// router.route('/get-task').get(verifyToken,getTask)
router.route('/add-linked-task').post(verifyToken,addLinkedTask)
router.route('/add-story').post(verifyToken,addStory)
router.route('/email').get(verifyToken,mail)


module.exports = router;