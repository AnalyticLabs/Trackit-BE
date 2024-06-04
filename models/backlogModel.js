const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema({
 

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Please provide the Project ID"]
    },
    
   
    
    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: [false, "Please provide the Task ID"]
    }
},
{
    timestamps:true,
});


module.exports = mongoose.model('Backlog', backlogSchema);