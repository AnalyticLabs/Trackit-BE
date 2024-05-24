const IssueType = require('../models/issueTypeModel')

exports.addIssue = async(req,res) =>{

    try {

        const role = req.user.role
        const {projectId} = req.query

        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let issues = req.body
        const newIssues = []

        for(const element of issues) {
            const {name } = element
            const nameExist = await IssueType.findOne({name,projectId})
            if(nameExist) {
                return res.status(409).json({
                    success:false,
                    message:"IssueType with this name already exists"
                })
            }
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
                newIssues.push({
                    id:issueObj._id,
                    name: issueObj.name
                });
            }
        }

        return res.status(200).json({
            success:true,
            message:"Issue Types added successfully",
            newIssues
        })
        

    } catch (error) {
        console.log(error)

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
            issue:issueTypes
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.deleteIssue = async(req,res) =>{
    try {
        const {issueId} = req.body

        const issue = await IssueType.findById({_id: issueId})
        if(issue.canBeDeleted === false) {
            return res.status(403).json({success:false,message:"Cannot Delete This issue item"})
        }
        return res.status(200).json({success:true,message:"IssueType deleted successfully"})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}