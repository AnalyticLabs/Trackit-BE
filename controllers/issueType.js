const IssueType = require('../models/issueTypeModel')

exports.addIssue = async(req,res) =>{

    try {

        const role = req.user.role
        const {projectId} = req.query

        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let issues = req.body

        for(const element of issues) {
            const {name } = element
            if(element.issueId) {
                const issueObj = await IssueType.findById({_id:element.issueId})
                if(!issueObj) {
                    return res.status(404).json({
                        success:false,
                        message: 'Invalid issueType Id'
                    })
                }

                issueObj.name = name
                await issueObj.save()
            }

            else {
                const issueObj = await IssueType.create({name,projectId})
            }
        }

        return res.status(200).json({
            success:true,
            message:"Issue Types added successfully"
        })
        

    } catch (error) {
        // console.log(error)

        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getIssueTypes = async (req,res) =>{

    try {
        const {projectId} = req.query

        const issueTypes = await IssueType.find({projectId:projectId}).select('name')
        const count = await IssueType.find().countDocuments({projectId:projectId})

        return res.status(200).json({
            success:true,
            TotalCount: count,
            issueTypes
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}