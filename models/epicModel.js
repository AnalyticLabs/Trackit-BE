const mongoose = require("mongoose");

const epicSchema = new mongoose.Schema({
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
        required: [false, "Please provide the assigniee"],
    },

    tags:[{
        type:String,
        required: [false, "Please provide tags"],
    }],

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Please provide the Sprint ID"]
    },
    
    
    
},
{
    timestamps:true,
});


module.exports = mongoose.model('Epic', epicSchema);