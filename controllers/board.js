const Board = require('../models/boardModel')


exports.addBoard = async(req,res) =>{

    try {
        
        const role = req.user.role
        const{ projectId} = req.query
        
        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let boards = req.body

        for(const element of boards) {
            const {name , color} = element
            if(element.boardId) {
                const boardObj = await Board.findById({_id:element.boardId})
                if(!boardObj) {
                    return res.status(404).json({
                        success:false,
                        message: 'Invalid board Id'
                    })
                }

                boardObj.name = name
                boardObj.color = `#${color}`
                await boardObj.save()
            }

            else {
                const boardObj = await Board.create({
                    name,
                    color: `#${color}`,
                    projectId:projectId,
                })
            }
        }

        return res.status(200).json({
            success:true,
            message:"Boards added successfully"
        })
        

    } catch (error) {
        // console.log(error);

        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

exports.getBoard = async(req,res) =>{

    try {
        const {projectId} = req.query
        const boards = await Board.find({projectId:projectId}).select('name')
        const count = await Board.countDocuments({projectId:projectId})

        return res.status(200).json({
            success:true,
            TotalCount: count,
            boards
        })


    } catch (error) {
        // console.log(error);

        return res.status(500).json({success:false,message:"Internal Server Error"});  
    }
}