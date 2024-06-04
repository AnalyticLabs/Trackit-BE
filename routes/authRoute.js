const express = require("express");
const router = express.Router();

const {projectRecord, getProject} = require("../controllers/project");
const verifyToken = require("../middleware/authenticate");
const { getBoard } = require("../controllers/board");
const { getIssueTypes } = require("../controllers/issueType");
const { getPriorityTypes } = require("../controllers/priorityType");
const { getStatus } = require("../controllers/status");
const { myInfo, logout, searchUsers } = require("../controllers/auth");
const { getSprint, searchSprint } = require("../controllers/sprint");
const { getEpic, getStory, searchTask, getTask, addLogTime } = require("../controllers/task");
const { addComment, getComments, editComment, deleteComment, getHistory } = require("../controllers/comment");
const { getBacklog, searchBacklog } = require("../controllers/backlog");

/**
 * @swagger
 * /trackit/v1/api/add-project:
 *   post:
 *     summary: Create a project
 *     security:
 *       - bearerAuth: []
 *     description: Create a project with data
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 */

router.route("/get-all-projects").get(verifyToken, projectRecord);
router.route("/get-boards").get(verifyToken, getBoard);
router.route("/get-issues").get(verifyToken, getIssueTypes);
router.route("/get-priorities").get(verifyToken, getPriorityTypes);
router.route("/get-status").get(verifyToken, getStatus);

router.route('/my-info').get(verifyToken,myInfo)
router.route('/logout').get(verifyToken,logout)

router.route('/get-sprint').get(verifyToken,getSprint)
router.route('/get-epic').get(verifyToken,getEpic)
router.route('/get-story').get(verifyToken,getStory)
router.route('/search-employees').get(verifyToken,searchUsers)
router.route('/get-tasks').get(verifyToken,getTask)
router.route('/search-tasks').get(verifyToken,searchTask)
router.route('/add-log-time').post(verifyToken,addLogTime)
router.route('/add-comment').post(verifyToken,addComment)
router.route("/get-comment").get(verifyToken,getComments)
router.route('/edit-comment').post(verifyToken,editComment)
router.route('/delete-comment').delete(verifyToken,deleteComment)
router.route('/get-history').get(verifyToken,getHistory)
router.route('/get-backlogs').get(verifyToken,getBacklog)
router.route('/search-backlog').get(verifyToken,searchBacklog)
router.route('/search-sprints').get(verifyToken,searchSprint)


// Get project for monnit
router.route('/get-projects').get(verifyToken,getProject)


module.exports = router;
