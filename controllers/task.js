const Epic = require('../models/epicModel')
const Story = require('../models/storyModel')
const Task = require('../models/taskModel')
const Sprint = require('../models/sprintModels')
const Board = require('../models/boardModel')
const Status = require("../models/statusModel")
const Priority = require("../models/priorityTypeModel")
const IssueType = require('../models/issueTypeModel')
const UsedData = require('../models/usedDataModel')

exports.createEpic = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {title, description, tags, assignee, sprintId} = req.body

        const epic = await Epic.create({
            title,
            description,
            tags,
            assignee,
            sprintId
        })

        return res.status(200).json({
            success:true,
            message:"Epic created successfully",
             id:epic._id
            })

    } catch (error) {
        // console.log(error)
        return res.json(200).json({success:false,message:"Internal Server Error"})
    }
}

exports.getEpic = async(req,res) =>{
    try {
        const {search} = req.query

        const epic = await Epic.find({title:{$regex:search,$options:'i'}}).select('_id title')
        if(!epic) {
            return res.status(404).json({success:false,message:"No epic found"})
        }

        return res.status(200).json({success:true,epic})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.createStory = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }
        
        const {title, description, tags, assignee, epicId} = req.body
        
        const story = await Story.create({
            title,
            description,
            tags,
            assignee,
            epicId
        })
        
        return res.status(200).json({
            success:true,
            id:story._id
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getStory = async(req,res) =>{
    try {
        const {search} = req.query
        const story = await Story.find({title:{$regex:search,$options:'i'}})
            .populate('epicId', 'title  tags')

        return res.status(200).json({success:true,story})
    } catch (error) {
        console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.createTask = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {
            title,
            description,
            assignee, 
            issue, 
            storyId, 
            sprintId, 
            tags, 
            priority, 
            status
        } = req.body

        const task = await Task.create({
            title,
            description,
            assignee, 
            issueType:issue, 
            storyId, 
            sprintId, 
            tags, 
            priority, 
            status
        })

        const sprint = await Sprint.findByIdAndUpdate(sprintId,{$push:{tasks:task._id}})
            .select('projectId')
        //
        // chceking for IssueType
        const projectId = sprint.projectId
        const usedDataExist = await UsedData.findOne({projectId})
        const usedIssue = await IssueType.findOne({name:issue,projectId:projectId})
        const usedPriority = await Priority.findOne({name:priority,projectId:projectId})

        if(!usedDataExist) {

        // const usedData = await UsedData.findOne({projectId})
        
            const usedDataDoc = await UsedData.create({
                // {$addToSet:{priority:usedPriority._id}}
                issueTypes:usedIssue._id,
                priorities:usedPriority._id ,
                projectId:projectId
            })
        
        } else{
            const usedDataDoc = await UsedData.updateOne({projectId},
                {$addToSet :
                    {issueTypes:usedIssue._id,
                    priorities:usedPriority._id}
                })
        }
        
     
        //
        return res.status(200).json({
            success:true,
            task
        })

    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.UsedDataInfo = async(req,res) =>{
    try {
        const {projectId} = req.query
        const dataInfo  = await UsedData.find({projectId})
            .select('board status issueTypes priorities')
        return res.status(200).json({dataInfo})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}