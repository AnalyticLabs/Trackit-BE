const express = require("express");
const router = express.Router();
const verifyAuth = require("../middleware/authenticate");

const { addProject } = require("../controllers/project");


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
router.route("/add-project").post(addProject);


module.exports = router;