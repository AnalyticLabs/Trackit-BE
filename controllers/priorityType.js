const Priority = require("../models/priorityTypeModel")

exports.addPriorityType = async(req,res) =>{

    try {

        const role = req.user.role
        const {projectId} = req.query

        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let priorities = req.body
        const newPriorities = []

        for(const element of priorities) {
            const {name } = element
            if(element.priorityId) {
                const priorityObj = await Priority.findById({_id:element.priorityId})
                if(!priorityObj) {
                    return res.status(404).json({
                        success:false,
                        message: 'Invalid priority Type Id'
                    })
                }

                priorityObj.name = name
                await priorityObj.save()
            }

            else {
                const priorityObj = await Priority.create({name,projectId})
                newPriorities.push({
                    id:priorityObj._id,
                    name: priorityObj.name
                })
            }
        }

        return res.status(200).json({
            success:true,
            message:"Priority Types added successfully",
            newPriorities
        })
        

    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getPriorityTypes = async (req,res) =>{

    try {
        const {projectId} = req.query
        
        const priorities = await Priority.find({projectId:projectId}).select('name')
        const count = await Priority.find().countDocuments({projectId:projectId})

        return res.status(200).json({
            success:true,
            TotalCount: count,
            priorities
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.deletePriority = async(req,res) =>{
    try {
        const {priorityId} = req.body;
        const priority = await Priority.findByIdAndDelete({_id:priorityId});

        return res.status(200).json({success:true,message:"Priority deleted successfully"})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}