const Board = require('../models/boardModel')


exports.addBoard = async(req,res) =>{

    try {
        
        const role = req.user.role
        const{ projectId} = req.query
        
        if(role !== "Admin") {
            return res.status(403).json({success:false, message:"Only Admins are allowed to access this route" })
        }

        let boards = req.body
        const newBoards = []

        for(const element of boards) {
            const {name , color} = element
            const nameExist = await Board.findOne({name,projectId})
            if(nameExist) {
                return res.status(409).json({
                    success:false,
                    message:"Board with this name already exists"
                })
            }
            
            if(element.boardId) {
                const boardObj = await Board.findById({_id:element.boardId})
                if(!boardObj) {
                    return res.status(404).json({
                        success:false,
                        message: 'Invalid board Id'
                    })
                }

                boardObj.name = name
                boardObj.color = `${color}`
                await boardObj.save()
            }

            else {
                const boardObj = await Board.create({
                    name,
                    color: `${color}`,
                    projectId:projectId,
                })

                newBoards.push({
                    id:boardObj._id,
                    name:boardObj.name,
                    color:boardObj.color
                })
            }
        }

        return res.status(200).json({
            success:true,
            message:"Boards added successfully",
            newBoards
        })
        

    } catch (error) {
        // console.log(error);

        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

exports.getBoard = async(req,res) =>{

    try {
        const {projectId} = req.query
        const boards = await Board.find({projectId:projectId}).select('name color')
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

exports.deleteBoard = async(req,res) =>{
    try {
        const {boardId} = req.body

        const board = await Board.findById({_id:boardId})
        if(!board) {
            return res.status(404).json({success:false,message:"Board not found by this ID"})
        }
        if(board.canBeDeleted === false) {
            return res.status(403).json({success:false,message:"Cannot Delete This board item"})
        }

        await Board.deleteOne({_id:boardId})

        return res.status(200).json({success:true,message:"Board deleted successfully"})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}