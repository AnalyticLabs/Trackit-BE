const cron = require("node-cron");
const Project = require("../models/projectModel");
const Backlog = require("../models/backlogModel")
const Sprint = require('../models/sprintModels')

exports.createBacklog = cron.schedule("0 0 0 * * *",async()=>{
    console.log("Creating Backlog...")

    try {
        const projects = await Project.find({}).sort({createdAt:1})
        
        for (const project of projects) {
            const projectId = project._id
            // console.log("proejct in whcihc we are checking is", projectId)

        let backlogs = []
        const currentDay = new Date();
        const sprints = await Sprint.find({projectId, isComplete:false,endDate:{$lt:currentDay}})
            .populate({
                path:"tasks", select:" name status",
             
            })

            // console.log(sprints)

            for(const sprint of sprints) {
                const {tasks} = sprint
                const filteredTask = tasks.filter((task)=> task.status !== "Completed")
                backlogs.push(...filteredTask)
            }


            for (const task of backlogs) {
                const backlogExist = await Backlog.findOne({task:task._id})
                if(!backlogExist) {

                    await Backlog.create({projectId,task:task._id})
                }
            }
            
        }
    } catch (error) {
        console.log(error)
    }
})