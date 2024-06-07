const mongoose = require("mongoose");

const epicSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please Provide epic title"]
    },

    description:{
        type: String,
        required: [true, "Please Provide epic decription"]
    },

    assignee:{
        username:{
            type: String,
            required: [true, "Please Provide username"]
        },
        
        avtar:{
            type: String,
        }
        
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