const mongoose = require("mongoose");
const Project = require("../models/project");
const { default: axios } = require("axios");
const { errorLogger, logger } = require("../utils/winstonLogger");
const jwt = require("jsonwebtoken");

exports.addProject = async (req, res) => {
  const { name, ownership, key, manager, lead } = req.body;

  try {
    // checking if project with this name exits already
    const projectExists = await Project.findOne({ name });
    if (projectExists) {
      // error logging
      errorLogger.error({
        Route: req.url,
        UserId: req.user._id,
        Error: `Project with  name:${name}  already exists`,
      });

      return res.status(409).json({
        success: false,
        message: `Project with  name:${name}  already exists`,
      });
    }

    const data = { owner: ownership, manager, lead };
    const token = req.user.accessToken;
    // console.log('accesstoke from req.user.accesstoken is:',token)

    let projectOwner;
    let projectLead;
    let projectManager;

    const MONNIT_URL = process.env.MONNIT_URL
    try {
      const response = await axios.post(
        `${MONNIT_URL}/api/verify-stakeholders`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //  console.log(response.data)

      projectOwner = response.data.projectOwner;
      projectLead = response.data.projectLead;
      projectManager = response.data.projectManager;
    } catch (error) {
      // console.log(error)

      // error logging
      errorLogger.error({
        Route:req.url,
        RequestBody: { data },
        UserId: req.user._id,
        Error: `Wrong stakeholders data`,
      });

      return res
        .status(404)
        .json({ success: false, message: "Wrong stakeholders data" });
    }

    // Info Logging
    logger.info({
      Route: req.url,
      UserId: req.user._id,
      RequestBody: { name, ownership, key, manager, lead },
    });

    const project = await Project.create({
      name,
      ownership: projectOwner,
      key,
      manager: projectManager,
      lead: projectLead,
      companyId: req.user.company,
    });

    return res
      .status(200)
      .json({ success: true, message: "Project added successfully", project });
  } catch (error) {
    // console.log(error);

    // error logging
    errorLogger.error({
      Route: req.url,
      UserId: req.user._id,
      RequestBody: { name, ownership, key, manager, lead },
      Error: error.message,
    });

    res
      .status(500)
      .json({ success: false, message: "Unable to add project. Server Error" });
  }
};

exports.editProjectInfo = async (req, res) => {
  const { name, ownership, key, manager, lead, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      // Error logging
      errorLogger.error({
        Route: req.url,
        UserId: req.user._id,
        Error: `Project with ID:${projectId} not found!`,
      });

      return res
        .status(401)
        .json({ sucess: false, message: "Project not found!" });
    }

    const data = { owner: ownership, manager, lead };

    const token = req.user.accessToken;

    let projectOwner;
    let projectLead;
    let projectManager;

    const MONNIT_URL = process.env.MONNIT_URL

    try {
      const response = await axios.post(
        `${MONNIT_URL}/api/verify-stakeholders`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response.data)

      //  const {projectOwner , projectLead, projectManager} = response.data
      projectOwner = response.data.projectOwner;
      projectLead = response.data.projectLead;
      projectManager = response.data.projectManager;
    } catch (error) {
      // console.log(error)

      // error logging
      errorLogger.error({
        Route: req.url,
        RequestBody: { data },
        UserId: req.user._id,
        Error: `Wrong stakeholders data`,
      });

      return res
        .status(404)
        .json({ success: false, message: "Wrong stakeholders data" });
    }

    // Info Logging
    logger.info({
      Route: req.url,
      UserId: req.user._id,
      RequestBody: { name, ownership, key, manager, lead },
    });

    project.name = name;
    project.key = key;
    project.ownership = projectOwner;
    project.manager = projectManager;
    project.lead = projectLead;
    await project.save();

    return res.status(200).json({
      sucess: true,
      message: "project updated successfully",
      project,
    });
  } catch (error) {
    // console.log(error)

    // error logging
    errorLogger.error({
      Route: req.url,
      UserId: req.user._id,
      RequestBody: { name, ownership, key, manager, lead },
      Error: error.message,
    });

    return res
      .status(501)
      .json({ sucess: false, message: "internal server error" });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.query;
  try {
    const projectExists = await Project.findById(id);

    if (!projectExists) {
      // Error logging
      errorLogger.error({
        Route: req.url,
        UserId: req.user._id,
        Error: `Project with ID:${id} not found!`,
      });

      return res
        .status(404)
        .json({ sucess: false, message: "project not found" });
    }

    // Info Logging
    logger.info({
      Route: req.url,
      UserId: req.user._id,
      RequestQuery: id,
    });

    await Project.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ sucess: true, message: "project deleted successfully" });
  } catch (error) {
    // console.log(error)

    // Error logging
    errorLogger.error({
      Route: req.url,
      UserId: req.user._id,
      RequestQuery: id,
      Error: error.message,
    });

    return res
      .status(501)
      .json({ sucess: false, message: "internal server error" });
  }
};

exports.projectRecord = async (req, res) => {
  try {
    
    const projects = await Project.find({ companyId: req.user.company }).sort({
      createdAt: 1,
    });

    // console.log(req.user._id)
    const count = await Project.find({companyId: req.user.company,}).countDocuments();

    if (!projects) {
      // Error logging
      errorLogger.error({
        Route: req.url,
        UserId: req.user._id,
        Error: "No Projects Found",
      });

      return res.status(404).json(`No projects found`);
    }

    // Info Logging
    logger.info({
      Route: req.url,
      UserId: req.user._id,
    });

    return res.status(200).json({ TotalCount: count, projects });
  } catch (error) {
    // Error logging
    errorLogger.error({
      Route: req.url,
      UserId: req.user._id,
      Error: error.message,
    });

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
