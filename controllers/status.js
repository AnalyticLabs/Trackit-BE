const Status = require("../models/statusModel")


exports.addStatus = async(req,res) =>{

    try {

        const role = req.user.role
        const {projectId} = req.query

        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let status = req.body
        // let boardIds = []
        for(const element of status) {
            const {name ,before,after} = element
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
            }
        }

        return res.status(200).json({
            success:true,
            message:"Status added successfully"
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