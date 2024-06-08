const Comment = require("../models/commentsModel")
const History = require('../models/taskHistoryModel')

exports.addComment = async(req,res) =>{
    try {
        
        const {taskId, comment} = req.body
        // console.log(req.user)

        if(!taskId || !comment) {
            return res.status(400).json({success:false,message:"Please Provide TaskId & comment "})
        }
        const newAddedComment = await Comment.create({
            user:{
                username:req.user.username,
                avtar:req.user.avtar
            },
            comment,
            time:Date.now(),
            task:taskId
        })

        const newComment = {
            _id:newAddedComment._id,
            user:newAddedComment.user,
            comment:newAddedComment.comment,
            time:newAddedComment.time
        }

        return res.status(200).json({success:true,newComment})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getComments = async(req,res) =>{
    try {
        const {taskId} = req.query
        if(!taskId) {
            return res.status(400).json({success:false,message:"Please Provide taskID"})
        }

        const comments = await Comment.find({task:taskId})
            .select('user comment time ')
            .sort({time:1})

        return res.status(200).json({success:true,comments})

    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.editComment = async(req,res) =>{
    try {
        const {commentId, comment} = req.body
        if(!commentId || !comment){
            return res.status(400).json({success:false,message:"Please Provide CommentId & comment "})
        }

        const oldComment = await Comment.findOneAndUpdate(
            {_id:commentId},
            comment,
            {new:true}
        )

        if(!oldComment) {
            return res.status(404).json({success:false,message:"No Comment Found With This ID"})
        }

        const newComment = {
            _id:commentId,
            user:oldComment.user,
            time:oldComment.time
        }

        return res.status(200).json({success:true,newComment})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.deleteComment = async(req,res) =>{
    try {
        const {commentId} = req.query
        if(!commentId) {
            return res.status(400).json({success:false,message:"Please Provide CommentID"})
        }

        await Comment.findByIdAndDelete({_id:commentId})
        return res.status(200).json({success:true,message:"Comment deleted"})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getHistory = async(req,res) =>{
    try {
        const {taskId} = req.query
        if(!taskId) {
            return res.status(400).json({success:false,message:"Please Provide TaskId"})
        }

        const history = await History.find({task:taskId})
            .select('user assignee status type time ')
            .sort({time:1})

        return res.status(200).json({success:true,history})
    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.getAllHistory =  async(req,res) =>{
    try {
        
        const {taskId} = req.query
        if(!taskId ) {
            return res.status(400).json({success:false,message:"Please Provide taskID & flag"})
        }

        let comments
        let history
        let toSend
        // console.log(flag)
        
            
        comments = await Comment.find({task:taskId})
            .select('user comment time ')
            .sort({time:1})


        history = await History.find({task:taskId})
            .select('user assignee status type time ')
            .sort({time:1})
        
        const combinedResult = [...comments,...history]

        combinedResult.sort((a,b)=> (a.time - b.time))

        toSend = combinedResult
            

        return res.status(200).json({toSend})

    } catch (error) {
        // console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}