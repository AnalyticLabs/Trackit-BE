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

