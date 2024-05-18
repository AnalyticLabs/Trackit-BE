const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: [true, "Please Provide board name"]
    },

    startDate:{
        type: Date,
        required: [false, "Please Provide color"]
    },

    endDate:{
        type: Date,
        required: [false, "Please Provide color"]
    },

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Please provide the Project ID"]
    },
    
    isComplete:{
        type:Boolean,
        default: false
    },
    
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: [false, "Please provide the Task ID"]
    }]
},
{
    timestamps:true,
});


module.exports = mongoose.model('Sprint', sprintSchema);