const Status = require("../models/statusModel")


exports.addStatus = async(req,res) =>{

    try {

        const role = req.user.role
        const {projectId} = req.query

        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let status = req.body
        const newStatus = []

        for(const element of status) {
            const {name ,before,after} = element

            if (!Array.isArray(after) || after.length === 0) {
                return res.status(400).json({ success: false, message: "after field cannot be empty" });
            }

            if(element.statusId) {
                const statusObj = await Status.findById({_id:element.statusId})
                if(!statusObj) {
                    return res.status(404).json({
                        success:false,
                        message: 'Invalid status Id'
                    })
                }

                statusObj.name = name
                statusObj.before = before
                statusObj.after = after

                await statusObj.save()
            }

            else {
                const statusObj = await Status.create({
                    name,
                    before,
                    after,
                    projectId
                })
                

                newStatus.push({
                    id:statusObj._id,
                    name:statusObj.name,
                    before:statusObj.before,
                    after:statusObj.after
                })
            }
        }

        return res.status(200).json({
            success:true,
            message:"Status added successfully",
            newStatus
        })
        

    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getStatus = async (req,res) =>{

    try {
        const {projectId} = req.query
        
        const status = await Status.find({projectId:projectId}).select('name after before')
        const count = await Status.find().countDocuments({projectId:projectId})

        return res.status(200).json({
            success:true,
            TotalCount: count,
            status
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.deleteStatus = async(req,res) =>{
    try {
        const {statusId} = req.body;
        const status = await Status.findByIdAndDelete({_id:statusId});

        return res.status(200).json({success:true,message:"Status delete successfully"})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}