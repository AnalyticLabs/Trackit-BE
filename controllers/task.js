const Epic = require('../models/epicModel')
const Story = require('../models/storyModel')
const Task = require('../models/taskModel')
const Sprint = require('../models/sprintModels')
const Board = require('../models/boardModel')
const Status = require("../models/statusModel")
const Priority = require("../models/priorityTypeModel")
const IssueType = require('../models/issueTypeModel')
const UsedData = require('../models/usedDataModel')
const History = require('../models/taskHistoryModel')
const Backlog = require("../models/backlogModel")
const Comment = require("../models/commentsModel")
const { sendEmail } = require('../utils/email')
const { getUserInfo } = require('../utils/userInfo')

exports.createEpic = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {title, description, tags, assignee, projectId} = req.body
        if(!title || !description || !tags || !assignee || !projectId) {
            return res.status(400),json({success:false,message:"All field are required"})
        }

        const isExist = await Epic.findOne({title,projectId})
        if(isExist) {
            return res.status(409).json({success:false,message:"Epic with this name already exists"})
        }
        
        // getting assignee info from monnit db
        const token = req.user.accessToken;
        const id = assignee
        const apiResponse = await getUserInfo(token,id)

        const userInfo = {
            username:apiResponse.username,
            avtar:apiResponse.avtar
        }
        const epic = await Epic.create({
            title,
            description,
            tags,
            assignee:userInfo,
            projectId
        })

        return res.status(200).json({
            success:true,
            message:"Epic created successfully",
             id:epic._id
            })

    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getEpic = async(req,res) =>{
    try {
        const {search,projectId} = req.query

        const epic = await Epic.find({title:{$regex:search,$options:'i'},projectId}).select('_id title')
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
        
        const {title, description, tags, assignee, epicId,  projectId} = req.body
        
        const isExist = await Story.findOne({title,projectId})
        if(isExist) {
            return res.status(409).json({success:false,message:"Story with this name already exists"})
        }

        // getting assignee info from monnit db
        const token = req.user.accessToken;
        const id = assignee
        const apiResponse = await getUserInfo(token,id)

        const userInfo = {
            username:apiResponse.username,
            avtar:apiResponse.avtar
        }

        const story = await Story.create({
            title,
            description,
            tags,
            assignee:userInfo,
            epicId,
            projectId
        })
        
        return res.status(200).json({
            success:true,
            id:story._id
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getStory = async(req,res) =>{
    try {
        const {search, projectId} = req.query
        const story = await Story.find({title:{$regex:search,$options:'i'},projectId})
            .select('epicId title  tags')

        return res.status(200).json({success:true,story})
    } catch (error) {
        // console.log(error)

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
            type, 
            storyId, 
            sprintId,
            linkedTask, 
            tags, 
            priority, 
            expectedTime,
            projectId
        } = req.body

        const isExist = await Task.findOne({title,projectId})
        if(isExist) {
            return res.status(409).json({success:false,message:"Task with this name already exists"})
        }

        // getting assignee info from monnit db
        const token = req.user.accessToken;
        const id = assignee
        const userInfo = await getUserInfo(token,id)

        const task = await Task.create({
            title,
            description,
            assignee:userInfo, 
            linkedTask,
            type, 
            storyId, 
            sprintId, 
            tags, 
            priority, 
            status:"Todo",
            expectedTime,
            projectId
        })

        const sprint = await Sprint.findByIdAndUpdate(sprintId,{$push:{tasks:task._id}})
            .select('projectId')
        //
        // chceking for IssueType
        const projectID = sprint.projectId
        const usedDataExist = await UsedData.findOne({projectID})
        const usedIssue = await IssueType.findOne({name:type,projectId:projectID})
        const usedPriority = await Priority.findOne({name:priority,projectId:projectID})

        if(!usedDataExist) {

        // const usedData = await UsedData.findOne({projectId})
        
            const usedDataDoc = await UsedData.create({
                // {$addToSet:{priority:usedPriority._id}}
                issueTypes:usedIssue._id,
                priorities:usedPriority._id ,
                projectId:projectID
            })
        
        } else{
            const usedDataDoc = await UsedData.updateOne({projectID},
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

// exports.getTask = async(req,res) =>{
//     try {
//         const {id}  =req.query
//         const task = await Task.find({})
//             .populate({
//                 path:"linkedTask",select:"title tags priority"
//             })
//         return res.status(200).json({task})
//     } catch (error) {
//         console.log(error)
//     }
// }

exports.addLinkedTask = async(req,res) =>{
    try {
        const {taskId, linkedTask} = req.body
        if(!taskId || !linkedTask) {
            return res.status(400).json({success:false,message:"Please Send Both Task Id & Task which is to be linked"})
        }

        if(taskId === linkedTask) {
            return res.status(409).json({success:false,message:"Cannot link task to itself "})
        }
        const task = await Task.findOneAndUpdate(
            {_id:taskId},
            {$addToSet:{linkedTask:linkedTask}},
            {new:true, populate: [
                {path:"linkedTask", select:"title status tags"},
            ]}
        )
        // console.log(task)
        const addedTask = task.linkedTask[task.linkedTask.length - 1]

        return res.status(200).json({success:true,addedTask})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.addStory = async(req,res) =>{
    try {
        
        const {taskId, storyId} = req.body
        if(!taskId || !storyId) {
            return res.status(400).json({success:false,message:"Please Send Both Task Id & Story Id"})
        }

        const task = await Task.findOneAndUpdate(
            {_id:taskId},
            {$addToSet:{storyId}},
            {new:true, populate: [
                {path:"linkedTask", select:"title status tags"},
                {path:"sprintId", select:"name"},
                {
                    path:"storyId", select:"title description epicId tags assignee",
                    populate:[
                        {
                            path:"epicId", select:" tags "
                        }
                    ]
                }
            ]}
        )

        const addedStory = task.storyId[task.storyId.length - 1]
        return res.status(200).json({success:true,addedStory})
    } catch (error) {
        // console.log(error)
        return res.status(200).json({success:false,message:"Internal Server Error"})
    }
}

exports.changePriority = async(req,res) =>{
    try {
        const {taskId, priority} = req.body
        
        if(!taskId || !priority) {return res.status(400).json({
            success:false,message:"Please Provide TaskId & status "
        })}

        const task = await Task.findById({_id:taskId})
        if(!task) {
            return res.status(404).json({success:false,message:"No Task Found with this ID"})
        }

        const validPriority = await Priority.findOne({name:priority,projectId:task.projectId})
        if(!validPriority) {
            return res.status(404).json({success:false,message:"No Priority Found with this Name"})
        }
        task.priority = priority
        await task.save()

        return res.status(200).json({success:true,message:"Task Priority changed"})

    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.changeAssignee = async(req,res) =>{
    try {
        const {taskId, newAssignee} = req.body
        if(!taskId || !newAssignee) {return res.status(400).json({
            success:false,message:"Please Provide TaskId & New Assignee"
        })}

        const token = req.user.accessToken;
        const id = newAssignee
        const apiResponse = await getUserInfo(token,id)

        const userInfo = {
            username:apiResponse.username,
            avtar:apiResponse.avtar,
            email:apiResponse.email
        }
     
        const task = await Task.findById({_id:taskId}).select("assignee")
        if(!task) {
            return res.status(404).json({success:false,message:"No Task Found with this ID"})
        }

        
        const oldAssigneeUsername =  task.assignee.username 
        const oldAssigneeAvtar = task.assignee.avtar

        const oldAssignee = {
            username: oldAssigneeUsername,
            avtar: oldAssigneeAvtar
        }

        const newAssigneeInfo = {
            username:userInfo.username,
            avtar:userInfo.avtar
        }

        task.assignee = apiResponse 
        await task.save()

        // logging this change to Task History
        await History.create({
            user:{
                username:req.user.username,
                avtar:req.user.avtar
            },
            type:"AssigneeLog",
            assignee:{
                oldAssignee,
                newAssignee:newAssigneeInfo
            },
            time:Date.now(),
            task:taskId
        })

        return res.status(200).json({success:true,message:"Assigne changed Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}


exports.deleteTask = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {taskId} = req.body
        const deletedTask = await Task.findByIdAndDelete({_id:taskId})

        return res.status(200).json({success:true,message:"Task deleted successfully"})
    } catch (error) {
        // console.error(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.searchTask = async(req,res) =>{
    try {
        const {search, projectId} = req.query
        const tasks = await Task.find({title:{$regex:search,$options:'i'},projectId})
            .select('title _id')

        return res.status(200).json({success:true,tasks})
    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getTask = async(req,res) =>{
    try {
        const {projectId} = req.query
        const tasks = await Task.find({projectId})
            .select(' _id status title description type assignee storyId linkedTask sprintId tags logTime priority expectedTime ')
            .populate([
                {path:"linkedTask", select:"title status tags"},
                {path:"sprintId", select:"name"},
                {
                    path:"storyId", select:"title description epicId tags assignee",
                    populate:[
                        {
                            path:"epicId", select:"title description tags assignee"
                        }
                    ]
                }
            ])

        
        const taskComments = {}

        for (let task of tasks) {
            const commentCount = await Comment.countDocuments({ task: task._id });
            taskComments[task._id] = {
                ...task.toObject(),
                totalComments: commentCount
            }
        }

        // console.log(taskComments)
        
        const groupedTasks = {};
        Object.values(taskComments).forEach(task => {
            if (!groupedTasks[task.status]) {
                groupedTasks[task.status] = [];
            }
            groupedTasks[task.status].push(task);
        });
        
        let count = tasks.reduce((count, task) => {
            if (!count[task.status]) {
                count[task.status] = 0;
            }
            count[task.status]++;
            return count;
        }, {});
        
        
        // const count = await Task.find({projectId}).countDocuments()
        return res.status(200).json({success:true,TotalCount:count,groupedTasks})
    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.mail= async(req,res) =>{
    try {
        const {subject, to, body} = req.body
        
        sendEmail(subject,to,body)
        return res.status(200).json({success:true,message:"email sent"})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"error sending email"})
    }
}

exports.changeStatus = async(req,res) =>{
    try {
        
        const {taskId, status} = req.body
        
        if(!taskId || !status) {return res.status(400).json({
            success:false,message:"Please Provide TaskId & status "
        })}

        const task = await Task.findById({_id:taskId})
        if(!task) {
            return res.status(404).json({
                success:false,message:"No task found with this ID"
            })
        }

        // console.log(task)
        const allowedStatus = await Status.findOne({name:task.status})

        // To check if status from req body is valid. ( )
        const validStatus = await Status.findOne({name:status,projectId:task.projectId})
        if(!validStatus) {
            return res.status(404).json({
                success:false,message:"No status found with this name"
            })
        }


        const oldStatus = task.status
        // Throw error if user change status which doesnt follow status life cycle from setting page
        if( !allowedStatus.before.includes(status) && !allowedStatus.after.includes(status) ) {
            return res.status(422).json({
                success:false,message:`Cannot Change Task Status directly to ${status}`
            })
        }

        // task.status = status
        // await task.save()

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId }, // Filter
            { $set: { status: status } }, // Update
            { new: true } // Options: Return the updated document
        );
        // Removing this task if it exists in backlog
        if(status === "Completed") {

            const backlog = await Backlog.findOne({task:taskId})
            if(backlog) {
                await Backlog.deleteOne({task:taskId})
            }
        }

          // logging this change to Task History
          await History.create({
            user:{
                username:req.user.username,
                avtar:req.user.avtar
            },
            type:"statusLog",
            status:{
                oldStatus,
                newStatus:status
            },
            time:Date.now(),
            task:taskId
        })

        return res.status(200).json({success:true,message:"Changed task Status Successfully!"})

    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.addLogTime = async(req,res) =>{
    try {
        const {taskId, time} = req.body
    
        
        const timeSpent = time.trim();
        const logTime = {
            user: req.user.username,
            timeSpent,
            createdAt:Date.now()
        }

        // task.logTime.push(logTime)
        // await task.save()

        const task = await Task.findOneAndUpdate(
            {_id:taskId},
            {$addToSet:{logTime}},
            {new:true, populate: [
                {path:"linkedTask", select:" logTime"},
                
            ]}
        )

        return res.status(200).json({
            success:true,
            message:"Log time Added successfully",
            AddedLogTime: task.logTime[task.logTime.length - 1]
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}