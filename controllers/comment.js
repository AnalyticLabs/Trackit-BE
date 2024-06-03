const Comment = require("../models/commentsModel")
const History = require('../models/taskHistoryModel')

exports.addComment = async(req,res) =>{
    try {
        
        const {taskId, comment} = req.body
        // console.log(req.user)

        if(!taskId || !comment) {
            return res.status(400).json({success:false,message:"Please Provide TaskId & comment "})
        }
        const newComment = await Comment.create({
            user:{
                username:req.user.username,
                avtar:req.user.avtar
            },
            comment,
            time:Date.now(),
            task:taskId
        })

        return res.status(200).json({success:true,message:"Comment Added successfully"})
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

        const oldComment = await Comment.findById({_id:commentId})
        if(!oldComment) {
            return res.status(404).json({success:false,message:"No Comment Found With This ID"})
        }

        oldComment.comment = comment
        await oldComment.save();

        return res.status(200).json({success:true,message:"Comment Updated Successfully!"})
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