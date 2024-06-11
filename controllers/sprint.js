const Sprint = require('../models/sprintModels')
const Comment = require("../models/commentsModel")


       // Function to convert given date string to unix timestamp
       const convertDate =(dateString) =>{
        // validating time format
        if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(dateString)) {
            throw new Error('Invalid date format. Expected format is dd/mm/yyyy');
        }

        let parts = dateString.split("/");
        let day = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);

        let date = new Date(year, month, day);
        // console.log("date is:",date)
        let timestamp = date.getTime();

        // console.log("timestamp is:",timestamp)

        let finalDate = new Date(timestamp)
        // console.log("fdate is:",finalDate)

        return finalDate
        }




exports.createSprint = async(req,res) =>{
    try {
        
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {name, startDate, endDate, projectId} = req.body

        const isExist = await Sprint.findOne({name,projectId})
        if(isExist) {
            return res.status(409).json({success:false,message:"Sprint with this name already exists"})
        }
 
        const sprintStartDate =  convertDate(startDate)
        const sprintEndDate = convertDate(endDate)
        // console.log("startDate is:",sprintStartDate)
        // console.log("endDate is:",sprintEndDate)
        const currentDay = new Date();

        // Date validation
        if(sprintStartDate < currentDay || sprintEndDate < currentDay) {
            return res.status(400).json({
                success:false,
                message:"Start Date & End Date cannot be less then today"
            })
        
        } else if( sprintEndDate < sprintStartDate ) {
            return res.status(400).json({
                success:false,
                message:"End Date cannot be less then Start Date"
            })
        }
  
        const sprint = await Sprint.create({
            name,
            startDate: sprintStartDate,
            endDate: sprintEndDate,
            projectId
        })
        
        return res.status(200).json({
            success:true,
            message:"Sprint created successfully",
            sprint
        })
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.editSprint = async(req,res) =>{
    try {
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {endDate, sprintId} = req.body
        const newEndDate = convertDate(endDate)

        const sprint = await Sprint.findById({_id:sprintId}).select('_id startDate endDate')
        if(!sprint) {
            return res.status(200).json({success:false, message:"No Sprint found with this Id."})
        }

        const currentDay = new Date();
        // console.log(`current Day is: ${currentDay}`)

        // Date validation
        if(newEndDate < currentDay) {
            return res.status(400).json({
                success:false,
                message:" End Date cannot be less then today"
            })
        
        } else if( newEndDate < sprint.endDate ) {
            return res.status(400).json({
                success:false,
                message:"End Date cannot be less then Start Date"
            })
        }

        
        

        sprint.endDate = newEndDate
        await sprint.save()

        return res.status(200).json({success:true,message:"Sprint edited successfully",sprint})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.markComplete = async(req,res) =>{
    try {
        
        const role = req.user.role

        if(role !== "Admin") {
            return res.status(403).json({success:false,message:"Only Admins are allowed to access this route"})
        }

        const {complete, sprintId} = req.body
        const sprint = await Sprint.findById({_id:sprintId})

        if(!sprint) {
            return res.status(200).json({success:false, message:"No Sprint found with this Id."})
        }

        if(complete) {

            sprint.isComplete = true
            await sprint.save()
        }

        return res.status(200).json({success:true,message:"Sprint marked as complete"})
    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getSprint = async(req,res) =>{
    try {

        const {projectId} = req.query

        const currentDay = new Date()
        const sprints = await Sprint.find({projectId,endDate:{$gt:currentDay}})
            .populate({
                path:"tasks", select:" status expectedTime title description assignee type tags priority logTime linkedTask storyId",
                populate:[
                    {path:"linkedTask", select:"title status tags"},
                
                    {
                        path:"storyId", select:"title tags description epicId assignee",
                        populate:[
                            {
                                path:"epicId", select:"title tags description assignee"
                            }
                        ]
                    }
                
                ]
            }).select('name startDate endDate isComplete tasks')


        const sprintWithComments = {}
        let count = {};

        // getting comments count  for each task
        for(let sprint of sprints) {
            const commentsCount = await Promise.all(sprint.tasks.map( async (task) => {
                const count = await Comment.countDocuments({task:task._id})


                return {...task.toObject(),totalComments:count}
            })) 

            // Inserting count of comments in task after converting it into plain json
            sprintWithComments[sprint.name] = {
                ...sprint.toObject(),
                tasks: commentsCount
            }
        }
        
        // Getting count of tasks in each sprint
        for(const element in sprintWithComments){
            const {tasks} = sprintWithComments[element]
            count[element] = tasks.length
        } 

            
        return res.status(200).json({
            success:true,
            TotalCount:count,
            sprint:Object.values(sprintWithComments)
        })
    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.searchSprint = async(req,res) =>{
    try {
        const {search, projectId} = req.query
        if(!search || !projectId) {
            return res.status(400).json({success:false,message:"Please Provide Both Query Parameter"})
        }

        const sprints = await Sprint.find({name:{$regex:search,$options:'i'},projectId}).select('_id')

        res.status(200).json({sucess:true,sprints})
        



    } catch (error) {
        // console.log(error)
        return res.status(500).json({sucess:false,message:"Internal Server Error"})
    }
}