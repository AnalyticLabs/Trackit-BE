const express = require("express");
const router = express.Router();

const {
  addProject,
  projectRecord,
  deleteProject,
  editProjectInfo,

} = require("../controllers/project");
const verifyToken = require("../middleware/authenticate");

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
router.route("/add-project").post(verifyToken, addProject);
router.route("/get-all-projects").get(verifyToken, projectRecord);
router.route("/delete-project").get(verifyToken, deleteProject);
router.route("/edit-project").post(verifyToken, editProjectInfo);

module.exports = router;
