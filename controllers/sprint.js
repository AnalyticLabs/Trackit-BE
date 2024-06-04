const Sprint = require('../models/sprintModels')


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

 
        const sprintStartDate =  convertDate(startDate)
        const sprintEndDate = convertDate(endDate)
        // console.log("startDate is:",sprintSartDate)
        // console.log("endDate is:",sprintEndDate)

        
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
        // console.log(error)
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
        const sprint = await Sprint.findById({_id:sprintId}).select('_id startDate endDate')

        if(!sprint) {
            return res.status(200).json({success:false, message:"No Sprint found with this Id."})
        }
        const newEndDate = convertDate(endDate)

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

        const sprint = await Sprint.find({projectId})
            .populate({
                path:"tasks", select:" status expectedTime title description assignee type tags priority logTime linkedTask storyId",
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
            }).select('name startDate endDate isComplete tasks')

        let count = {};
        
        for(const element of sprint){
            const {tasks} = element
            count[element.name] = tasks.length
        } 

        // const count = await Sprint.find({projectId}).countDocuments() 

            if(!sprint ) {
                return res.status(404).json({success:false,message:"No sprints found for this project"})
            } 
            
        return res.status(200).json({
            success:true,
            TotalCount:count,
            sprint
        })
    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}