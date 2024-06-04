const Sprint = require('../models/sprintModels')
const Task = require('../models/taskModel')
const Backlog = require("../models/backlogModel")

exports.getBacklog = async(req,res) =>{
    try {

        const {projectId} = req.query
       
        const backlogs = await Backlog.find({projectId})
        .populate({
            path:"task", select:" status expectedTime title description assignee type tags priority logTime linkedTask storyId",
            populate:[
                {path:"linkedTask", select:"title status tags"},
            
                {
                    path:"storyId", select:"title description epicId assignee",
                    populate:[
                        {
                            path:"epicId", select:"title description assignee"
                        }
                    ]
                }
            
            ]
        })
            .select("_id task")
        const count = await Backlog.find({projectId}).countDocuments()
            
        return res.status(200).json({
            success:true,
            TotalCount:count,
            backlogs
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.searchBacklog = async(req,res) =>{
    try {
        const {search, projectId} = req.query
        if(!search || !projectId) {
            return res.status(400).json({success:false,message:"Please Provide Both Query Parameter"})
        }

        const tasks = await Task.find({title:{$regex:search,$options:'i'},projectId})
        .select('title _id ')

        const condition = tasks.map(task => task.id)

        const backlogs = await Backlog.find({projectId, task: { $in:condition }})
        .populate({
            path:"task",select:" status title description type assignee storyId linkedTask sprintId tags logTime priority expectedTime ",
            populate:[
                {path:"linkedTask", select:"title status tags"},
                {path:"sprintId", select:"name"},
                {
                    path:"storyId", select:"title description epicId assignee",
                    populate:[
                        {
                            path:"epicId", select:"title description assignee"
                        }
                    ]
                }
            ]
        })
        

        return res.status(200).json({success:true,backlogs})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

