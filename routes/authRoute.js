const express = require("express");
const router = express.Router();

const {projectRecord} = require("../controllers/project");
const verifyToken = require("../middleware/authenticate");
const { getBoard } = require("../controllers/board");
const { getIssueTypes } = require("../controllers/issueType");
const { getPriorityTypes } = require("../controllers/priorityType");
const { getStatus } = require("../controllers/status");
const { myInfo, logout } = require("../controllers/auth");
const { getSprint } = require("../controllers/sprint");

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

module.exports = router;
