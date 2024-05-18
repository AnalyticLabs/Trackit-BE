const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    status:{
        type:String,
        required:[true,"Please provide task type"]
    },

    title:{
        type: String,
        unique: true,
        required: [true, "Please Provide epic title"]
    },

    description:{
        type: String,
        required: [true, "Please Provide epic decription"]
    },

    assignee:{
        type: String,
        required: [true, "Please provide the assigniee"],
    },

    issueType:{
        type: String,
        // ref: 'Task',
        required: [true, "Please provide the issue type"]
    },

    storyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: [true, "Please provide the story ID"]
    },

    sprintId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
        required: [true, "Please provide the Sprint ID"]
    },
    
    tags:[{
        type:String,
        required: [false, "Please provide tags"],
    }],

    priority:{
        type:String,
        required: [true, "Please Provide Priority"]
    },

    // expectedTime:{

    // }
    
    
},
{
    timestamps:true,
});


module.exports = mongoose.model('Task', taskSchema);